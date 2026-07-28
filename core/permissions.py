from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow full access to admins, read-only to others."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_superuser


class IsOwner(permissions.BasePermission):
    """Allow only the owner of the object to access it."""
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        return self._get_owner(obj) == request.user

    def _get_owner(self, obj):
        for attr in ('owner', 'user', 'tenant', 'investor', 'requester', 'client', 'payer'):
            if hasattr(obj, attr):
                try:
                    return getattr(obj, attr)
                except Exception:
                    pass
        return None


class IsAdminOnly(permissions.BasePermission):
    """Allow only superusers/staff."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.is_superuser or request.user.is_staff)


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow object authors/owners or admins to edit."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser:
            return True
        return IsOwner()._get_owner(obj) == user


class IsAgent(permissions.BasePermission):
    """Allow only users with role 'agent' or admin."""
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if getattr(user, 'role', None) == 'agent' or user.is_superuser:
            return True
        return False