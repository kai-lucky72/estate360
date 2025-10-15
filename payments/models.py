from django.db import models
from django.conf import settings
from tenancy.models import Lease
from investments.models import Investment
from contracts.models import Contract

User = settings.AUTH_USER_MODEL


class Payment(models.Model):
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('bank', 'Bank Transfer'),
        ('mobile', 'Mobile Money'),
        ('card', 'Credit/Debit Card'),
    ]

    PAYMENT_TYPES = [
        ('rent', 'Rent'),
        ('investment', 'Investment'),
        ('contract', 'Contract Fee'),
        ('other', 'Other'),
    ]

    payer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='payments')
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    reference = models.CharField(max_length=100, unique=True)
    date = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)

    lease = models.ForeignKey(Lease, on_delete=models.SET_NULL, null=True, blank=True, related_name='lease_payments')
    investment = models.ForeignKey(Investment, on_delete=models.SET_NULL, null=True, blank=True, related_name='investment_payments')
    contract = models.ForeignKey(Contract, on_delete=models.SET_NULL, null=True, blank=True, related_name='contract_payments')

    def __str__(self):
        return f"{self.payment_type} - {self.amount} ({self.reference})"

    class Meta:
        ordering = ['-date']
        verbose_name = "Payment Record"
        verbose_name_plural = "Payments"
