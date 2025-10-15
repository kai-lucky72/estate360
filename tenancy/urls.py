from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TenancyViewSet

router = DefaultRouter()
router.register(r'tenancys', TenancyViewSet, basename='tenancys')

urlpatterns = [
    path('', include(router.urls)),
]
