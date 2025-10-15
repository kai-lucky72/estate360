from rest_framework import viewsets, permissions
from .models import Investment
from .serializers import InvestmentSerializer
from core.permissions import IsOwnerOrAdmin

class InvestmentViewSet(viewsets.ModelViewSet):
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]
