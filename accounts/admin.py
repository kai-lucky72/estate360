from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "phone", "address", "profile_image")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "role", "is_verified")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "role"),
        }),
    )
    list_display = ("email", "username", "role", "is_staff", "is_verified")
    search_fields = ("email", "username", "role")
    list_filter = ("role", "is_staff", "is_verified")
    ordering = ("email",)
