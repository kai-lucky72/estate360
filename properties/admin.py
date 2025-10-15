from django.contrib import admin
from .models import Property, PropertyImage, PropertyDocument


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1


class PropertyDocumentInline(admin.TabularInline):
    model = PropertyDocument
    extra = 1


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("title", "price", "status", "date_added", "owner")
    list_filter = ("status", "category", "date_added", "owner")
    search_fields = ("title", "location", "owner__username")
    inlines = [PropertyImageInline, PropertyDocumentInline]
