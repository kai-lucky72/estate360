from rest_framework import viewsets, permissions
from .models import Agent, AgentPropertyAssignment, Commission
from .serializers import AgentSerializer, AgentPropertyAssignmentSerializer, CommissionSerializer

class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [permissions.IsAuthenticated]

class AgentPropertyAssignmentViewSet(viewsets.ModelViewSet):
    queryset = AgentPropertyAssignment.objects.all()
    serializer_class = AgentPropertyAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class CommissionViewSet(viewsets.ModelViewSet):
    queryset = Commission.objects.all()
    serializer_class = CommissionSerializer
    permission_classes = [permissions.IsAuthenticated]
