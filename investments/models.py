from django.db import models
from accounts.models import User
from properties.models import Property

class Investment(models.Model):
    investor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='investments')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='investments')
    amount_invested = models.DecimalField(max_digits=14, decimal_places=2)
    share_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    roi_estimate = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Investment by {self.investor.username} on {self.property.title}"
