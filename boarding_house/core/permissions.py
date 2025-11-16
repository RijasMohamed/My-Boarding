from rest_framework import permissions
from .models import UserProfile


class IsAdmin(permissions.BasePermission):
    """Only admin users can access"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Create profile if it doesn't exist (backward compatibility)
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'role': 'admin' if request.user.is_superuser else 'member'}
        )
        
        return profile.is_admin


class IsStaff(permissions.BasePermission):
    """Admin and staff can access"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Create profile if it doesn't exist (backward compatibility)
        # Superusers default to admin, others default to member
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'role': 'admin' if request.user.is_superuser else 'member'}
        )
        
        # If user is superuser but profile says member, upgrade to admin
        if request.user.is_superuser and not profile.is_admin:
            profile.role = 'admin'
            profile.save()
        
        return profile.is_staff


class IsMember(permissions.BasePermission):
    """Member can access (for member portal)"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Create profile if it doesn't exist
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'role': 'admin' if request.user.is_superuser else 'member'}
        )
        
        return profile.is_member


class IsOwnerOrStaff(permissions.BasePermission):
    """Member can only access their own data, staff/admin can access all"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Create profile if it doesn't exist
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'role': 'admin' if request.user.is_superuser else 'member'}
        )
        
        # If user is superuser but profile says member, upgrade to admin
        if request.user.is_superuser and not profile.is_admin:
            profile.role = 'admin'
            profile.save()
        
        # Staff and admin can access all
        if profile.is_staff:
            return True
        
        # Members can only access their own data
        if profile.is_member:
            return True
        
        return False
    
    def has_object_permission(self, request, view, obj):
        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'role': 'admin' if request.user.is_superuser else 'member'}
        )
        
        # Staff and admin can access all
        if profile.is_staff:
            return True
        
        # Members can only access their own data
        if profile.is_member:
            # Check if the object belongs to the member
            if hasattr(obj, 'member'):
                member = obj.member
                if hasattr(member, 'user') and member.user == request.user:
                    return True
            return False
        
        return False

