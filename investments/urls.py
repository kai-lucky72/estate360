from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import InvestmentViewSet

router = DefaultRouter()
router.register(r'investments', InvestmentViewSet, basename='investments')

urlpatterns = [
    path('', include(router.urls)),
]
