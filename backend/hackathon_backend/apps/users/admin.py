from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'last_name', 'first_name', 'patronymic', 'dealer_code', 'level', 'total_points', 'is_blocked')
    list_filter = ('level', 'position', 'is_blocked', 'is_active')
    search_fields = ('username', 'last_name', 'first_name', 'dealer_code', 'phone')

    fieldsets = UserAdmin.fieldsets + (
        ('Дополнительная информация', {
            'fields': ('dealer_code', 'position', 'phone', 'level',
                       'sber_id', 'registration_date', 'is_blocked', 'block_reason')
        }),
        ('Статистика', {
            'fields': ('total_deals', 'total_volume', 'bank_share',
                       'volume_points', 'deals_points', 'share_points')
        }),
    )

    readonly_fields = ('registration_date',)