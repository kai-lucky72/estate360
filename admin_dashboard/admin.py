from django.contrib import admin
from .models import SystemReport, DashboardStat, SystemLog


@admin.register(SystemReport)
class SystemReportAdmin(admin.ModelAdmin):
    list_display = ("updated_at", "total_users", "total_properties", "total_revenue")


@admin.register(DashboardStat)
class DashboardStatAdmin(admin.ModelAdmin):
    list_display = ("date", "total_users", "total_properties", "total_contracts", "total_payments")
    list_filter = ("date",)


@admin.register(SystemLog)
class SystemLogAdmin(admin.ModelAdmin):
    list_display = ("actor", "action", "timestamp")
    search_fields = ("action", "details")
