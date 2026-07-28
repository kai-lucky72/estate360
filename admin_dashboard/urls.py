from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardSummaryView, AdminUserViewSet, AdminPropertyViewSet,
    AdminBookingViewSet, AdminPaymentViewSet, AdminContractViewSet,
    AdminAgentViewSet, SystemLogViewSet, DashboardStatViewSet,
)

router = DefaultRouter()
router.register(r'users', AdminUserViewSet, basename='admin-user')
router.register(r'properties', AdminPropertyViewSet, basename='admin-property')
router.register(r'bookings', AdminBookingViewSet, basename='admin-booking')
router.register(r'payments', AdminPaymentViewSet, basename='admin-payment')
router.register(r'contracts', AdminContractViewSet, basename='admin-contract')
router.register(r'agents', AdminAgentViewSet, basename='admin-agent')
router.register(r'logs', SystemLogViewSet, basename='admin-log')
router.register(r'stats', DashboardStatViewSet, basename='admin-stat')

urlpatterns = [
    path('summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('', include(router.urls)),
]