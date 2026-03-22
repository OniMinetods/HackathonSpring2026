from django.urls import path
from .views import (
    DailyResultTodayView,
    PrivilegeListView,
    ScenarioCalculatorView,
)

urlpatterns = [
    path('privileges/', PrivilegeListView.as_view(), name='privilege-list'),
    path(
        'scenario-calculator/',
        ScenarioCalculatorView.as_view(),
        name='scenario-calculator',
    ),
    path(
        'daily-result/today/',
        DailyResultTodayView.as_view(),
        name='daily-result-today',
    ),
]
