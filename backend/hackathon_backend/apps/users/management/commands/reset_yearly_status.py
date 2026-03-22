from django.core.management.base import BaseCommand
from django.utils import timezone
from backend.hackathon_backend.apps.users.models import User


class Command(BaseCommand):
    help = 'Reset yearly status counters for new year'

    def handle(self, *args, **options):
        current_year = timezone.now().year

        self.stdout.write(f'Resetting status counters for year {current_year}')

        users_reset = 0
        for user in User.objects.all():
            try:
                user.reset_yearly_status_months()
                users_reset += 1
                if users_reset % 100 == 0:
                    self.stdout.write(f'Reset {users_reset} users...')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error resetting user {user.id}: {e}'))

        self.stdout.write(self.style.SUCCESS(
            f'Successfully reset status counters for {users_reset} users'
        ))