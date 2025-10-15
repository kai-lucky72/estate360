from rest_framework import serializers
from .models import PropertyAnalytics, AgentPerformance, InvestmentTrend
from properties.serializers import PropertySerializer
from agents.serializers import AgentSerializer

class PropertyAnalyticsSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)

    class Meta:
        model = PropertyAnalytics
        fields = "__all__"


class AgentPerformanceSerializer(serializers.ModelSerializer):
    agent = AgentSerializer(read_only=True)

    class Meta:
        model = AgentPerformance
        fields = "__all__"


class InvestmentTrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestmentTrend
        fields = "__all__"
