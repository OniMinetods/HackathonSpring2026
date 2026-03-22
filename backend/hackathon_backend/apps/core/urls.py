from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrivilegeListView, ScenarioCalculatorView

router = DefaultRouter()

urlpatterns = [
    path('privileges/', PrivilegeListView.as_view(), name='privilege-list'),
    path(
        'scenario-calculator/',
        ScenarioCalculatorView.as_view(),
        name='scenario-calculator',
    ),
]