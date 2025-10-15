from rest_framework import serializers
from .models import Agent, AgentPropertyAssignment, Commission
from properties.serializers import PropertySerializer
from accounts.serializers import UserSerializer

class AgentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Agent
        fields = "__all__"

class AgentPropertyAssignmentSerializer(serializers.ModelSerializer):
    property = PropertySerializer()
    class Meta:
        model = AgentPropertyAssignment
        fields = "__all__"

class CommissionSerializer(serializers.ModelSerializer):
    property = PropertySerializer()
    class Meta:
        model = Commission
        fields = "__all__"
