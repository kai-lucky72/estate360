from rest_framework import viewsets, permissions
from .models import PropertyAnalytics, AgentPerformance, InvestmentTrend
from .serializers import (
    PropertyAnalyticsSerializer,
    AgentPerformanceSerializer,
    InvestmentTrendSerializer,
)

class PropertyAnalyticsViewSet(viewsets.ModelViewSet):
    queryset = PropertyAnalytics.objects.select_related("property")
    serializer_class = PropertyAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]


class AgentPerformanceViewSet(viewsets.ModelViewSet):
    queryset = AgentPerformance.objects.select_related("agent__user")
    serializer_class = AgentPerformanceSerializer
    permission_classes = [permissions.IsAuthenticated]


class InvestmentTrendViewSet(viewsets.ModelViewSet):
    queryset = InvestmentTrend.objects.select_related("investment", "investor")
    serializer_class = InvestmentTrendSerializer
    permission_classes = [permissions.IsAuthenticated]
