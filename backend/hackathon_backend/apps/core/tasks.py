from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count, Q
from apps.users.models import User, MonthlyPlan, Application, MonthlyRating
from apps.core.models import Deal


@shared_task
def calculate_monthly_ratings():
    """
    Расчёт рейтинга для всех активных пользователей за предыдущий месяц.
    """
    today = timezone.now().date()
    # Определяем предыдущий месяц
    first_day_this_month = today.replace(day=1)
    last_day_prev_month = first_day_this_month - timedelta(days=1)
    prev_month = last_day_prev_month.month
    prev_year = last_day_prev_month.year

    # Получаем всех активных пользователей (не заблокированных)
    users = User.objects.filter(is_active=True, is_blocked=False)

    for user in users:
        # 1. Получаем плановые показатели на этот месяц
        plan = MonthlyPlan.objects.filter(
            user=user,
            year=prev_year,
            month=prev_month
        ).first()
        if not plan:
            # Если плана нет, пропускаем или используем дефолтные значения
            continue

        # 2. Агрегируем фактические данные за месяц
        deals = Deal.objects.filter(
            user=user,
            date__year=prev_year,
            date__month=prev_month
        )
        fact_volume = deals.aggregate(Sum('amount'))['amount__sum'] or 0
        fact_deals = deals.count()
        # Доля банка: сделки, где is_financed=True
        bank_deals = deals.filter(is_financed=True).count()
        fact_share = (bank_deals / fact_deals * 100) if fact_deals > 0 else 0

        # 3. Конверсия
        applications = Application.objects.filter(
            user=user,
            date__year=prev_year,
            date__month=prev_month
        )
        total_apps = applications.count()
        approved_apps = applications.filter(is_approved=True).count()
        fact_conversion = (approved_apps / total_apps * 100) if total_apps > 0 else 0

        # 4. Рассчитываем индексы
        volume_index = min(120, (fact_volume / plan.volume_plan * 100)) if plan.volume_plan > 0 else 0
        deals_index = min(120, (fact_deals / plan.deals_plan * 100)) if plan.deals_plan > 0 else 0
        share_index = min(120, (fact_share / plan.target_share * 100)) if plan.target_share > 0 else 0
        conversion_index = min(120, (fact_conversion / plan.conversion_plan * 100)) if plan.conversion_plan > 0 else 0

        # 5. Итоговые баллы
        total_points = (
            0.35 * volume_index +
            0.25 * deals_index +
            0.25 * share_index +
            0.15 * conversion_index
        )

        # 6. Определяем уровень
        if total_points < 70:
            level = 'silver'
        elif 70 <= total_points < 90:
            level = 'gold'
        else:
            level = 'black'

        # 7. Сохраняем результат
        MonthlyRating.objects.update_or_create(
            user=user,
            year=prev_year,
            month=prev_month,
            defaults={
                'volume_index': volume_index,
                'deals_index': deals_index,
                'share_index': share_index,
                'conversion_index': conversion_index,
                'total_points': total_points,
                'level': level,
            }
        )

        # 8. Обновляем поле current_month_points и level в модели User
        user.current_month_points = total_points
        user.level = level
        user.save()