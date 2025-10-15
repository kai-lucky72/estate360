from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("property", "client", "agent", "scheduled_date", "status")
    list_filter = ("status", "scheduled_date", "created_at")
    search_fields = ("property__title", "client__username", "agent__username")
