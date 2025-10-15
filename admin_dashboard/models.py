from django.db import models
from django.conf import settings

class SystemReport(models.Model):
    total_users = models.PositiveIntegerField(default=0)
    total_properties = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"System Report ({self.updated_at})"


class DashboardStat(models.Model):
    """Aggregated daily stats for the admin dashboard."""
    date = models.DateField()
    total_users = models.PositiveIntegerField(default=0)
    total_properties = models.PositiveIntegerField(default=0)
    total_contracts = models.PositiveIntegerField(default=0)
    total_payments = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        unique_together = ("date",)
        ordering = ["-date"]

    def __str__(self):
        return f"DashboardStat {self.date}"


class SystemLog(models.Model):
    """Lightweight audit log for admin dashboard views."""
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="system_logs")
    action = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        actor = getattr(self.actor, "username", "system")
        return f"{actor}: {self.action} @ {self.timestamp}"
