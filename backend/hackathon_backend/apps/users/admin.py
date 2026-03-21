from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'last_name', 'first_name', 'patronymic', 'dealer_code', 'level', 'total_points', 'is_blocked')
    list_filter = ('level', 'position', 'is_blocked', 'is_active')
    search_fields = ('username', 'last_name', 'first_name', 'dealer_code', 'phone')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Персональная информация'), {
            'fields': (
                'last_name', 'first_name', 'patronymic', 'dealer_code',
                'position', 'phone', 'email', 'level',
                'registration_date', 'sber_id'
            )
        }),
        (_('Статистика'), {
            'fields': ('total_deals', 'total_volume', 'bank_share',
                      'volume_points', 'deals_points', 'share_points')
        }),
        (_('Права доступа'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_blocked',
                      'block_reason', 'groups', 'user_permissions'),
        }),
    )

    readonly_fields = ('registration_date', 'last_login', 'date_joined')