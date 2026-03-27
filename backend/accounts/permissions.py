from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    # Called before every request — returns False to block, True to allow
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)
