from django.contrib import admin
from .models import Contract


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ("id", "property", "client", "agent", "status", "start_date", "end_date", "is_fully_signed")
    list_filter = ("status", "created_at")
    search_fields = ("property__title", "client__username", "agent__username")
    readonly_fields = ("created_at",)
