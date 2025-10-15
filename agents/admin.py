from django.contrib import admin
from .models import Agent, AgentPropertyAssignment, Commission

class AgentPropertyInline(admin.TabularInline):
    model = AgentPropertyAssignment
    extra = 1

class CommissionInline(admin.TabularInline):
    model = Commission
    extra = 1

@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ("user", "license_number", "verified", "rating")
    list_filter = ("verified",)
    inlines = [AgentPropertyInline, CommissionInline]

@admin.register(AgentPropertyAssignment)
class AgentPropertyAssignmentAdmin(admin.ModelAdmin):
    list_display = ("agent", "property", "active", "assigned_on")

@admin.register(Commission)
class CommissionAdmin(admin.ModelAdmin):
    list_display = ("agent", "property", "amount", "paid", "date_earned")
