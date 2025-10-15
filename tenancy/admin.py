from django.contrib import admin
from .models import Tenant, Lease, RentPayment


class RentPaymentInline(admin.TabularInline):
    model = RentPayment
    extra = 0


class LeaseInline(admin.TabularInline):
    model = Lease
    extra = 0


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'id_number')
    search_fields = ('user__username', 'id_number')
    inlines = [LeaseInline]


@admin.register(Lease)
class LeaseAdmin(admin.ModelAdmin):
    list_display = ('property', 'tenant', 'start_date', 'end_date', 'rent_amount', 'active')
    search_fields = ('property__title', 'tenant__user__username')
    list_filter = ('active',)
    inlines = [RentPaymentInline]


@admin.register(RentPayment)
class RentPaymentAdmin(admin.ModelAdmin):
    list_display = ('lease', 'amount_paid', 'payment_date', 'verified')
    list_filter = ('verified',)
