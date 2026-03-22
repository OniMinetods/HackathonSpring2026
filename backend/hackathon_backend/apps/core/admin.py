from django.contrib import admin
from .models import Privilege

@admin.register(Privilege)
class PrivilegeAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_description', 'financial_effect_rub', 'role')
    list_filter = ('role',)
    search_fields = ('name', 'short_description')