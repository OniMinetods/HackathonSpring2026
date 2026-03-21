from django.contrib import admin
from .models import (
    Level, Privilege, Deal, DailyResult, Task, UserTask,
    Rating, News, TrainingModule, TrainingTest, UserTraining,
    SupportTicket, SupportMessage, Bonus
)


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'min_points', 'financial_effect')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Privilege)
class PrivilegeAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'status', 'financial_effect')
    list_filter = ('level', 'status')


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'amount', 'additional_products')
    list_filter = ('date',)
    search_fields = ('user__username', 'user__last_name')


@admin.register(DailyResult)
class DailyResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'deals_count', 'volume')
    list_filter = ('date',)
    search_fields = ('user__username',)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'task_type', 'target_value', 'reward_points', 'is_active')
    list_filter = ('task_type', 'is_active')


@admin.register(UserTask)
class UserTaskAdmin(admin.ModelAdmin):
    list_display = ('user', 'task', 'status', 'progress_percent')
    list_filter = ('status',)


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'total_points', 'dealer_rank', 'global_rank')
    list_filter = ('date',)


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_published', 'created_at')
    list_filter = ('is_published', 'created_at')


@admin.register(TrainingModule)
class TrainingModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_video', 'reward_points', 'order')
    list_filter = ('is_video',)


@admin.register(TrainingTest)
class TrainingTestAdmin(admin.ModelAdmin):
    list_display = ('module', 'question')
    list_filter = ('module',)


@admin.register(UserTraining)
class UserTrainingAdmin(admin.ModelAdmin):
    list_display = ('user', 'module', 'is_completed', 'test_score')
    list_filter = ('is_completed',)


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('user', 'subject', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'subject')


@admin.register(SupportMessage)
class SupportMessageAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'author', 'created_at', 'is_from_support')
    list_filter = ('is_from_support',)


@admin.register(Bonus)
class BonusAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username',)