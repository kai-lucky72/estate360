from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Contract
from .serializers import ContractSerializer
from booking.models import Booking
from admin_dashboard.utils import log_system_action


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.select_related("booking", "property", "agent", "client")
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        booking_id = request.data.get("booking")
        if not booking_id:
            return Response({"error": "Booking ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Invalid booking ID"}, status=status.HTTP_404_NOT_FOUND)

        if booking.status != "approved":
            return Response({"error": "Only approved bookings can have contracts."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        log_system_action(request.user, f"Contract created from booking {booking_id}", f"Property: {booking.property}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def sign(self, request, pk=None):
        contract = self.get_object()
        contract.signed = True
        contract.save()
        log_system_action(request.user, f"Contract signed: {contract.id}", f"Property: {contract.property}")
        return Response({"status": "Contract signed"})
