from django.db import models
from django.conf import settings
from properties.models import Property

class Agent(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="agent_profile")
    bio = models.TextField(blank=True, null=True)
    license_number = models.CharField(max_length=100, unique=True)
    phone = models.CharField(max_length=20, blank=True)
    profile_image = models.ImageField(upload_to="agent_profiles/", blank=True, null=True)
    verified = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.license_number})"


class AgentPropertyAssignment(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name="assignments")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="assigned_agents")
    assigned_on = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("agent", "property")

    def __str__(self):
        return f"{self.agent} -> {self.property}"


class Commission(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name="commissions")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="commissions")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_earned = models.DateTimeField(auto_now_add=True)
    paid = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.agent} - {self.property} (${self.amount})"
