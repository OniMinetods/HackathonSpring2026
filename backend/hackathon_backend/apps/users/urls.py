from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('users', views.UserViewSet, basename='users')
router.register('auth', views.LoginViewSet, basename='auth')
router.register('plans', views.MonthlyPlanViewSet, basename='plans')
router.register('applications', views.ApplicationViewSet, basename='applications')
router.register('monthly-ratings', views.MonthlyRatingViewSet, basename='monthly-ratings')

urlpatterns = [
    path('', include(router.urls)),
]