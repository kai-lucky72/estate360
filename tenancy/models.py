from django.db import models
from django.conf import settings
from properties.models import Property
from contracts.models import Contract

User = settings.AUTH_USER_MODEL


class Tenant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tenant_profile')
    phone_number = models.CharField(max_length=20)
    id_number = models.CharField(max_length=50, unique=True)
    emergency_contact = models.CharField(max_length=100, blank=True, null=True)
    move_in_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username


class Lease(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='leases')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='leases')
    contract = models.OneToOneField(Contract, on_delete=models.SET_NULL, null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    rent_amount = models.DecimalField(max_digits=12, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.property.title} - {self.tenant.user.username}"


class RentPayment(models.Model):
    lease = models.ForeignKey(Lease, on_delete=models.CASCADE, related_name='payments')
    payment_date = models.DateField(auto_now_add=True)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2)
    receipt_number = models.CharField(max_length=50, unique=True)
    payment_method = models.CharField(max_length=30, choices=[
        ('cash', 'Cash'),
        ('bank', 'Bank Transfer'),
        ('mobile', 'Mobile Money'),
    ])
    verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Payment {self.receipt_number} - {self.amount_paid}"
