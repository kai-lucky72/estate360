from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('payment', 'Payment'),
        ('booking', 'Booking'),
        ('contract', 'Contract'),
        ('maintenance', 'Maintenance'),
        ('system', 'System'),
        ('message', 'Message'),
        ('investment', 'Investment'),
        ('alert', 'Alert'),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_notifications')

    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default=timezone.now)

    related_object_id = models.CharField(max_length=255, blank=True, null=True)
    related_app = models.CharField(max_length=100, blank=True, null=True)  # e.g. "payments", "contracts"

    def __str__(self):
        return f"{self.notification_type.title()} - {self.title} to {self.recipient}"

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
