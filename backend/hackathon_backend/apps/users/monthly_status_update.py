from django.core.management.base import BaseCommand
from django.utils import timezone
from .models import User


class Command(BaseCommand):
    help = 'Monthly status update for all users'

    def add_arguments(self, parser):
        parser.add_argument(
            '--date',
            type=str,
            help='Date for update (YYYY-MM-DD). Defaults to current date.',
        )

    def handle(self, *args, **options):
        if options['date']:
            from datetime import datetime
            check_date = datetime.strptime(options['date'], '%Y-%m-%d').date()
        else:
            check_date = timezone.now().date()

        self.stdout.write(f'Starting monthly status update for date: {check_date}')

        users_updated = 0
        for user in User.objects.all():
            try:
                user.monthly_status_update(check_date)
                users_updated += 1
                if users_updated % 100 == 0:
                    self.stdout.write(f'Updated {users_updated} users...')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error updating user {user.id}: {e}'))

        self.stdout.write(self.style.SUCCESS(
            f'Successfully updated status for {users_updated} users'
        ))