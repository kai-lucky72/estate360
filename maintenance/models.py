from django.db import models
from accounts.models import User
from properties.models import Property

class MaintenanceRequest(models.Model):
    STATUS = [('pending','Pending'),('in_progress','In Progress'),('completed','Completed'),('cancelled','Cancelled')]

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='maintenance_requests')
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='maintenance_requests')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.property.title} - {self.status}"
