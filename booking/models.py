from django.db import models
from django.conf import settings
from properties.models import Property

User = settings.AUTH_USER_MODEL


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="bookings")
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    agent = models.ForeignKey(User, on_delete=models.CASCADE, related_name="agent_bookings", null=True, blank=True)
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.client.username} - {self.property.title} ({self.status})"
