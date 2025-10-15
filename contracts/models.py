from django.db import models
from django.conf import settings
from booking.models import Booking
from properties.models import Property
import builtins

User = settings.AUTH_USER_MODEL


class Contract(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("active", "Active"),
        ("terminated", "Terminated"),
        ("completed", "Completed"),
    ]

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="contract")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="contracts")
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contracts_as_client")
    agent = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contracts_as_agent", null=True, blank=True)

    start_date = models.DateField()
    end_date = models.DateField()
    rent_amount = models.DecimalField(max_digits=12, decimal_places=2)
    terms = models.TextField()
    client_signed = models.BooleanField(default=False)
    agent_signed = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Contract #{self.id} - {self.property.title}"

    @builtins.property
    def is_fully_signed(self):
        return self.client_signed and self.agent_signed
