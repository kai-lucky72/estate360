from rest_framework.routers import DefaultRouter
from .views import PropertyAnalyticsViewSet, AgentPerformanceViewSet, InvestmentTrendViewSet

router = DefaultRouter()
router.register(r"property-analytics", PropertyAnalyticsViewSet, basename="property-analytics")
router.register(r"agent-performance", AgentPerformanceViewSet, basename="agent-performance")
router.register(r"investment-trends", InvestmentTrendViewSet, basename="investment-trends")

urlpatterns = router.urls
