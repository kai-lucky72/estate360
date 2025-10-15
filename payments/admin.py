from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('reference', 'payer', 'payment_type', 'amount', 'payment_method', 'verified', 'date')
    list_filter = ('payment_type', 'payment_method', 'verified', 'date')
    search_fields = ('reference', 'payer__username')
    list_editable = ('verified',)
    ordering = ('-date',)
