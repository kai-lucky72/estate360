from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AgentViewSet, AgentPropertyAssignmentViewSet, CommissionViewSet

router = DefaultRouter()
router.register(r'agents', AgentViewSet)
router.register(r'assignments', AgentPropertyAssignmentViewSet)
router.register(r'commissions', CommissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
