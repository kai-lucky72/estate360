from rest_framework import viewsets, permissions
from .models import MaintenanceRequest
from .serializers import MaintenanceRequestSerializer
from core.permissions import IsOwnerOrAdmin
from admin_dashboard.utils import log_system_action

class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRequest.objects.all()
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]

    def perform_create(self, serializer):
        req = serializer.save(requester=self.request.user)
        log_system_action(self.request.user, f"Maintenance request submitted: {req.id}", f"Property: {req.property}, Description: {req.description[:50]}")
