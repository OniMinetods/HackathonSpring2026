from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'last_name', 'first_name', 'patronymic', 'dealer_code',
                    'position', 'status', 'total_points', 'volume_points', 'deals_points', 'share_points', 'conversion_points')
    list_filter = ('status', 'position', 'is_active')
    search_fields = ('username', 'last_name', 'first_name', 'dealer_code', 'phone')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Персональная информация'), {
            'fields': (
                'last_name', 'first_name', 'patronymic', 'dealer_code',
                'position', 'phone', 'email', 'status',
                'date_joined', 'sber_id'
            )
        }),
        (_('Статистика'), {
            'fields': (
                'volume_of_transactions', 'number_of_transactions', 'bank_share',
                'conversion_rate', 'volume_points', 'deals_points', 'share_points',
                'conversion_points', 'total_points',
                'months_silver_current_year', 'months_gold_current_year',
                'months_platinum_current_year', 'months_year_tracker', 'last_monthly_credit_ym',
            )
        }),
        # (_('Личный финансовый эффект (год)'), {
        #     'fields': (
        #         'bonus_income_yearly_rub', 'mortgage_savings_yearly_rub',
        #         'cashback_yearly_rub', 'dms_yearly_rub',
        #     )
        # }),
        (_('Плановые показатели'), {
            'fields': (
                'volume_of_transactions_plan', 'number_of_transactions_plan',
                'bank_share_plan', 'conversion_rate_plan'
            )
        }),
        # (_('Права доступа'), {
        #     'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        # }),
    )

    readonly_fields = (
        'date_joined',
        'total_points',
        'volume_points',
        'deals_points',
        'share_points',
        'conversion_points',
        'months_year_tracker',
        'last_monthly_credit_ym',
    )