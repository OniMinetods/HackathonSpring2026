"""
Сценарный калькулятор: та же формула, что у User.total_points (35/25/25/15).
Клиент передаёт актуальный total_points; сервер считает projected_total_points
по метрикам пользователя после сценария (ползунки).
"""
from __future__ import annotations

from typing import Any, Dict, TYPE_CHECKING

if TYPE_CHECKING:
    from apps.users.models import User

# Синхрон с User.STATUS_THRESHOLDS
GOLD_THRESHOLD = 70
PLATINUM_THRESHOLD = 90


def _safe_divide(actual: float, plan: float, max_value: float | None = None) -> float:
    """Копия User._safe_divide."""
    actual = float(actual) if actual is not None else 0.0
    plan = float(plan) if plan is not None else 0.0
    if plan == 0:
        return 0.0
    result = (actual / plan) * 100
    if max_value is not None and result > max_value:
        return float(max_value)
    return result


def compute_total_points_like_user(
    volume: float,
    volume_plan: float,
    deals: float,
    deals_plan: float,
    bank_share: float,
    bank_share_plan: float,
    conversion: float,
    conversion_plan: float,
) -> float:
    """
    Аналог @property User.total_points (без побочных эффектов на модели).
    """
    vol_part = _safe_divide(volume, volume_plan) * 0.35
    deals_part = _safe_divide(deals, deals_plan) * 0.25
    share_part = _safe_divide(bank_share, bank_share_plan) * 0.25
    conv_part = _safe_divide(float(conversion), float(conversion_plan)) * 0.15
    total = vol_part + deals_part + share_part + conv_part
    return round(total, 2)


def status_from_points(points: float) -> str:
    if points < GOLD_THRESHOLD:
        return 'silver'
    if points < PLATINUM_THRESHOLD:
        return 'gold'
    return 'platinum'


def tier_display(status: str) -> str:
    if status == 'platinum':
        return 'Black'
    return status.capitalize()


def estimate_yearly_income_rub(points: float, status: str) -> int:
    tier_base = {'silver': 120_000, 'gold': 260_000, 'platinum': 420_000}
    base = tier_base.get(status, 120_000)
    return int(round(base + float(points) * 3800))


def estimate_mortgage_savings_rub(points: float, status: str) -> int:
    tier_base = {'silver': 380_000, 'gold': 560_000, 'platinum': 740_000}
    base = tier_base.get(status, 380_000)
    return int(round(base + float(points) * 6200))


def scenario_calculate(
    user: 'User',
    total_points_client: float,
    extra_deals: int = 0,
    extra_volume_million: float = 0,
    extra_share_steps: int = 0,
    extra_products: int = 0,
) -> Dict[str, Any]:
    """
    total_points_client — текущий рейтинг с клиента (как в профиле).
    projected_total_points — тот же расчёт total_points(), но по метрикам после сценария.
    """
    vol_plan = float(user.volume_of_transactions_plan)
    deals_plan = float(user.number_of_transactions_plan)
    share_plan = float(user.bank_share_plan)
    conv_plan = float(user.conversion_rate_plan)

    new_vol = float(user.volume_of_transactions) + float(extra_volume_million)
    new_deals = float(user.number_of_transactions) + int(extra_deals)
    new_share = float(user.bank_share) + int(extra_share_steps) * 5.0
    new_share = min(max(new_share, 0.0), 100.0)
    new_conv = float(user.conversion_rate) + int(extra_products)

    projected_total_points = compute_total_points_like_user(
        new_vol,
        vol_plan,
        new_deals,
        deals_plan,
        new_share,
        share_plan,
        new_conv,
        conv_plan,
    )

    base = round(float(total_points_client), 2)
    delta_points = round(projected_total_points - base, 2)
    projected_status = status_from_points(projected_total_points)

    return {
        'total_points': base,
        'projected_total_points': projected_total_points,
        'delta_points': delta_points,
        'projected_status': projected_status,
        'projected_tier_label': tier_display(projected_status),
        'yearly_income_rub': estimate_yearly_income_rub(
            projected_total_points, projected_status
        ),
        'mortgage_savings_rub': estimate_mortgage_savings_rub(
            projected_total_points, projected_status
        ),
    }
