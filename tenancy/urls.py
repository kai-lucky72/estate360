from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TenancyViewSet

router = DefaultRouter()
router.register(r'tenancies', TenancyViewSet, basename='tenancy')

urlpatterns = [
    path('', include(router.urls)),
]
