from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Reset yearly status counters for new year'

    def handle(self, *args, **options):
        current_year = timezone.now().year

        self.stdout.write(f'Resetting status counters for year {current_year}')

        users_reset = 0
        errors = 0

        for user in User.objects.all():
            try:
                user.reset_yearly_status_months()
                users_reset += 1
                if users_reset % 50 == 0:
                    self.stdout.write(f'Reset {users_reset} users...')
            except Exception as e:
                errors += 1
                self.stdout.write(self.style.ERROR(f'Error resetting user {user.id} ({user.username}): {e}'))

        self.stdout.write(self.style.SUCCESS(
            f'Successfully reset status counters for {users_reset} users. Errors: {errors}'
        ))