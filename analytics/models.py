from django.db import models
from django.conf import settings
from properties.models import Property
from agents.models import Agent
from investments.models import Investment

User = settings.AUTH_USER_MODEL


class PropertyAnalytics(models.Model):
    """Tracks key engagement metrics for each property."""
    property = models.OneToOneField(Property, on_delete=models.CASCADE, related_name="analytics")
    views = models.PositiveIntegerField(default=0)
    inquiries = models.PositiveIntegerField(default=0)
    favorites = models.PositiveIntegerField(default=0)
    average_rating = models.FloatField(default=0.0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Analytics for {self.property.title}"


class AgentPerformance(models.Model):
    """Performance analytics for each agent."""
    agent = models.OneToOneField(Agent, on_delete=models.CASCADE, related_name="performance")
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_rentals = models.IntegerField(default=0)
    client_satisfaction = models.FloatField(default=0.0)
    response_time = models.FloatField(default=0.0)  # in hours
    ranking_score = models.FloatField(default=0.0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Performance for {self.agent.user.username}"


class InvestmentTrend(models.Model):
    """Investment pattern insights across the platform."""
    investment = models.ForeignKey(Investment, on_delete=models.CASCADE, related_name="trends")
    investor = models.ForeignKey(User, on_delete=models.CASCADE)
    trend_type = models.CharField(
        max_length=50,
        choices=[("growth", "Growth"), ("decline", "Decline"), ("stable", "Stable")],
        default="stable",
    )
    roi_percentage = models.FloatField(default=0.0)
    trend_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.investor.username} - {self.trend_type} ({self.roi_percentage}%)"
