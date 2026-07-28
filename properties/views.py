from rest_framework import viewsets, permissions
from .models import Property
from .serializers import PropertySerializer
from admin_dashboard.utils import log_system_action


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user and request.user.is_superuser:
            return True
        return obj.owner == request.user


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().select_related('owner').prefetch_related('images', 'documents')
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        property = serializer.save(owner=self.request.user)
        log_system_action(self.request.user, f"Property created: {property.title}", f"Location: {property.location}, Price: {property.price}")
