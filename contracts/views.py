from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Contract
from .serializers import ContractSerializer
from booking.models import Booking


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
        return Response(serializer.data, status=status.HTTP_201_CREATED)
