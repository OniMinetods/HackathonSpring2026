from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'last_name', 'first_name', 'patronymic', 'dealer_code',
                    'position', 'status', 'total_points')
    list_filter = ('status', 'position', 'is_active')
    search_fields = ('username', 'last_name', 'first_name', 'dealer_code', 'phone')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Персональная информация'), {
            'fields': (
                'last_name', 'first_name', 'patronymic', 'dealer_code',
                'position', 'phone', 'email', 'status',
                'registration_date', 'sber_id'
            )
        }),
        (_('Статистика'), {
            'fields': (
                'volume_of_transactions', 'number_of_transactions', 'bank_share',
                'conversion_rate', 'total_points'
            )
        }),
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

    readonly_fields = ('registration_date', 'last_login', 'date_joined', 'total_points')