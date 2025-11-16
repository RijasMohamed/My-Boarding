"""
Management command to create UserProfile for existing users
Run: python manage.py create_user_profiles
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import UserProfile


class Command(BaseCommand):
    help = 'Create UserProfile for all existing users without profiles'

    def handle(self, *args, **options):
        users_without_profiles = User.objects.filter(profile__isnull=True)
        count = 0
        
        for user in users_without_profiles:
            # Superusers default to admin, others to member
            role = 'admin' if user.is_superuser else 'member'
            UserProfile.objects.create(user=user, role=role)
            count += 1
            self.stdout.write(
                self.style.SUCCESS(f'Created profile for {user.username} with role: {role}')
            )
        
        if count == 0:
            self.stdout.write(self.style.SUCCESS('All users already have profiles'))
        else:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created {count} user profile(s)')
            )

