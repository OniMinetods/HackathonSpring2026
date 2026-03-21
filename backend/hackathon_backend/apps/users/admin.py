from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User
from .models import User, MonthlyPlan, Application, MonthlyRating


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Административная панель для модели User."""
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


@admin.register(MonthlyPlan)
class MonthlyPlanAdmin(admin.ModelAdmin):
    """Админка для MonthlyPlan."""
    list_display = ('user', 'year', 'month', 'volume_plan', 'deals_plan', 'target_share', 'conversion_plan')
    list_filter = ('year', 'month')
    search_fields = ('user__username', 'user__last_name')


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    """Админка для Application."""
    list_display = ('user', 'date', 'is_approved')
    list_filter = ('date', 'is_approved')
    search_fields = ('user__username',)


@admin.register(MonthlyRating)
class MonthlyRatingAdmin(admin.ModelAdmin):
    """Админка для MonthlyRating."""
    list_display = ('user', 'year', 'month', 'total_points', 'level')
    list_filter = ('year', 'month', 'level')
    search_fields = ('user__username',)