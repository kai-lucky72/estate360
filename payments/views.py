from rest_framework import viewsets, permissions
from .models import Payment
from .serializers import PaymentSerializer
from notifications.utils import send_notification

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(payer=self.request.user)


def perform_create(self, serializer):
    payment = serializer.save(payer=self.request.user)
    send_notification(
        recipient=self.request.user,
        sender=None,
        title="Payment Received",
        message=f"Your payment of {payment.amount} has been recorded successfully.",
        notification_type='payment',
        related_object_id=payment.id,
        related_app='payments'
    )