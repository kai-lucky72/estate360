from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
from admin_dashboard.utils import log_system_action


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
        booking = serializer.save(client=self.request.user)
        log_system_action(self.request.user, f"Booking created: {booking.property}", f"Date: {booking.scheduled_date}")

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'cancelled'
        booking.save()
        log_system_action(request.user, f"Booking cancelled: {booking.id}", f"Property: {booking.property}")
        return Response({"status": "Booking cancelled"})
