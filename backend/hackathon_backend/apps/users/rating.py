"""
Рейтинг внутри дилерского центра и сумма баллов по кодам ДЦ.
"""
from __future__ import annotations

from collections import defaultdict
from typing import Any, Dict, List

from django.contrib.auth import get_user_model

User = get_user_model()


def _short_name(user) -> str:
    ln = (user.last_name or '').strip()
    fn = (user.first_name or '').strip()
    if ln and fn:
        return f'{ln} {fn[0]}.'
    if ln:
        return ln
    if fn:
        return fn
    return (user.username or '').strip() or f'#{user.pk}'


def _dealer_totals_from_map(by_code: dict[str, float]) -> List[Dict[str, Any]]:
    rows = sorted(by_code.items(), key=lambda x: (-x[1], x[0]))
    out: List[Dict[str, Any]] = []
    for i, (dc, total) in enumerate(rows[:10], start=1):
        out.append(
            {
                'rank': i,
                'dealer_code': dc,
                'total_points_sum': round(total, 2),
            }
        )
    return out


def build_dealer_center_rating(request_user) -> Dict[str, Any]:
    code = (request_user.dealer_code or '').strip()
    my_points = round(float(request_user.total_points), 2)

    by_code: defaultdict[str, float] = defaultdict(float)
    colleagues: list = []

    for u in User.objects.filter(is_active=True).iterator(chunk_size=500):
        dc = (u.dealer_code or '').strip()
        if dc:
            by_code[dc] += float(u.total_points)
        if code and dc == code:
            colleagues.append(u)

    dealer_totals_top = _dealer_totals_from_map(by_code)

    if not code:
        return {
            'dealer_code': '',
            'my_rank': None,
            'my_points': my_points,
            'top_10': [],
            'dealer_totals_top': dealer_totals_top,
        }

    scored = [(u, float(u.total_points)) for u in colleagues]
    scored.sort(key=lambda x: (-x[1], x[0].pk))

    my_rank: int | None = None
    top_10: List[Dict[str, Any]] = []
    for i, (u, pts) in enumerate(scored, start=1):
        if u.pk == request_user.pk:
            my_rank = i
        if len(top_10) < 10:
            top_10.append(
                {
                    'rank': i,
                    'user_id': u.pk,
                    'name': _short_name(u),
                    'total_points': round(pts, 2),
                }
            )

    return {
        'dealer_code': code,
        'my_rank': my_rank,
        'my_points': my_points,
        'top_10': top_10,
        'dealer_totals_top': dealer_totals_top,
    }
