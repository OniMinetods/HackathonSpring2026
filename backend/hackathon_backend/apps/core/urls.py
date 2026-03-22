from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrivilegeListView

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('privileges/', PrivilegeListView.as_view(), name='privilege-list'),
]