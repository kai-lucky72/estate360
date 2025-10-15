from rest_framework import viewsets, permissions
from .models import Booking
from .serializers import BookingSerializer


class IsClientOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.client == request.user


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related("property", "client", "agent")
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsClientOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)
