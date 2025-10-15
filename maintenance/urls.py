from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import MaintenanceRequestViewSet

router = DefaultRouter()
router.register(r'maintenancerequests', MaintenanceRequestViewSet, basename='maintenancerequests')

urlpatterns = [
    path('', include(router.urls)),
]
