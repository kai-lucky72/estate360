from rest_framework import viewsets, permissions
from .models import Lease
from .serializers import LeaseSerializer
from core.permissions import IsOwnerOrAdmin

class TenancyViewSet(viewsets.ModelViewSet):
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]
