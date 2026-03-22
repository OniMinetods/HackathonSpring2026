"""
Ежемесячный учёт: при первом запросе после смены календарного месяца
обновляется статус по баллам и в счётчик «месяцев в статусе … за год»
добавляется 1 для текущего уровня. При смене года счётчики обнуляются.
"""
from __future__ import annotations

from datetime import date

from django.db import transaction
from django.utils import timezone

from .models import User


def _parse_ym(s: str | None) -> date | None:
    if not s or len(s) < 7:
        return None
    try:
        y, m = int(s[:4]), int(s[5:7])
        return date(y, m, 1)
    except (ValueError, TypeError):
        return None


def _ym_next(d: date) -> date:
    if d.month == 12:
        return date(d.year + 1, 1, 1)
    return date(d.year, d.month + 1, 1)


def apply_monthly_status_credits(user_id: int) -> None:
    """
    Идемпотентно: для каждого пропущенного месяца от last_monthly_credit_ym
    до текущего включительно увеличивает соответствующий счётчик месяцев.
    """
    today = timezone.localdate()
    current_month_start = date(today.year, today.month, 1)

    with transaction.atomic():
        u = User.objects.select_for_update().get(pk=user_id)

        if not u.last_monthly_credit_ym:
            u.last_monthly_credit_ym = (
                f'{current_month_start.year}-{current_month_start.month:02d}'
            )
            u.save(update_fields=['last_monthly_credit_ym'])
            return

        last = _parse_ym(u.last_monthly_credit_ym)
        if last is None:
            u.last_monthly_credit_ym = (
                f'{current_month_start.year}-{current_month_start.month:02d}'
            )
            u.save(update_fields=['last_monthly_credit_ym'])
            return

        if last >= current_month_start:
            return

        months_to_process: list[date] = []
        d = _ym_next(last)
        while d <= current_month_start:
            months_to_process.append(d)
            d = _ym_next(d)

        for month_start in months_to_process:
            if (
                u.months_year_tracker is not None
                and u.months_year_tracker != month_start.year
            ):
                u.months_silver_current_year = 0
                u.months_gold_current_year = 0
                u.months_platinum_current_year = 0
            u.months_year_tracker = month_start.year

            new_status = u.current_status
            u.status = new_status
            if new_status == 'silver':
                u.months_silver_current_year += 1
            elif new_status == 'gold':
                u.months_gold_current_year += 1
            else:
                u.months_platinum_current_year += 1

        u.last_monthly_credit_ym = (
            f'{current_month_start.year}-{current_month_start.month:02d}'
        )
        u.save()
