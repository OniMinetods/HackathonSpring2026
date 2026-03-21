from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('levels', views.LevelViewSet, basename='levels')
router.register('privileges', views.PrivilegeViewSet, basename='privileges')
router.register('dashboard', views.DashboardViewSet, basename='dashboard')
router.register('financial-effect', views.FinancialEffectViewSet, basename='financial-effect')
router.register('rating', views.RatingViewSet, basename='rating')
router.register('calculator', views.CalculatorViewSet, basename='calculator')
router.register('deals', views.DealViewSet, basename='deals')
router.register('daily-results', views.DailyResultViewSet, basename='daily-results')
router.register('tasks', views.TaskViewSet, basename='tasks')
router.register('news', views.NewsViewSet, basename='news')
router.register('training', views.TrainingViewSet, basename='training')
router.register('support', views.SupportViewSet, basename='support')
router.register('bonuses', views.BonusViewSet, basename='bonuses')

urlpatterns = [
    path('', include(router.urls)),
]