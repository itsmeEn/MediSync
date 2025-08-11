from django.core.management.base import BaseCommand
from users.models import UserProfile

class Command(BaseCommand):
    help = 'Sync all Django users to Firebase Realtime Database'

    def handle(self, *args, **options):
        users = UserProfile.objects.all()
        count = 0
        
        for user in users:
            try:
                user.sync_to_firebase()
                count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully synced user: {user.full_name or user.username}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Failed to sync user {user.username}: {e}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully synced {count} users to Firebase')
        ) 