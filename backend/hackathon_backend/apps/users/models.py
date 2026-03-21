from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta


class User(AbstractUser):
    ROLE_CHOICES = [
        ('cso', 'КСО'),
        ('manager', 'Менеджер'),
        ('rop', 'РОП'),
        ('director', 'Директор'),
    ]

    STATUS_CHOICES = [
        ('silver', 'silver'),
        ('gold', 'gold'),
        ('platinum', 'platinum'),
    ]

    # Пороги баллов для статусов (включительно)
    STATUS_THRESHOLDS = {
        'silver': 0,
        'gold': 70,
        'platinum': 90,
    }

    patronymic = models.CharField('Отчество', max_length=150, blank=True)
    dealer_code = models.CharField('Код ДЦ', max_length=50, blank=True)
    position = models.CharField('Должность', max_length=20, choices=ROLE_CHOICES, default='manager')
    phone = models.CharField('Телефон', max_length=20, blank=True)
    status = models.CharField('Уровень привилегии', max_length=20, choices=STATUS_CHOICES, default='silver')
    registration_date = models.DateTimeField('Дата регистрации', auto_now_add=True)
    sber_id = models.CharField('Sber ID', max_length=100, blank=True)

    volume_of_transactions = models.FloatField('Объём сделок в рублях', default=0)
    number_of_transactions = models.FloatField('Количество сделок', default=0)
    bank_share = models.FloatField('Доля банка в портфеле', default=0)
    conversion_rate = models.IntegerField('Конверсия', default=0)

    volume_of_transactions_plan = models.FloatField('Объём сделок в рублях ПЛАН', default=10)
    number_of_transactions_plan = models.FloatField('Количество сделок ПЛАН', default=10)
    bank_share_plan = models.FloatField('Доля банка в портфеле ПЛАН', default=50)
    conversion_rate_plan = models.IntegerField('Конверсия ПЛАН', default=70)

    last_status_update = models.DateTimeField('Дата последнего обновления уровня', blank=True, null=True)


    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return f'{self.last_name} {self.first_name} {self.patronymic}'

    @staticmethod
    def _safe_divide(actual, plan, max_value=None):
        """Безопасное деление: actual / plan * 100, с ограничением сверху."""
        actual = float(actual) if actual is not None else 0.0
        plan = float(plan) if plan is not None else 0.0

        if plan == 0:
            return 0.0

        result = (actual / plan) * 100
        if max_value is not None and result > max_value:
            result = max_value
        return result

    @property
    def total_points(self):
        """Вычисляет итоговые баллы."""
        vol_index = self._safe_divide(
            self.volume_of_transactions,
            self.volume_of_transactions_plan,
            max_value=120
        )
        deals_index = self._safe_divide(
            self.number_of_transactions,
            self.number_of_transactions_plan
        )
        share_index = self._safe_divide(
            self.bank_share,
            self.bank_share_plan
        )
        conv_index = self._safe_divide(
            self.conversion_rate,
            self.conversion_rate_plan
        )

        total = (0.35 * vol_index +
                 0.25 * deals_index +
                 0.25 * share_index +
                 0.15 * conv_index)

        return round(total, 2)

    def get_status_by_points(self, points):
        """Определяет уровень по баллам."""
        if points < self.STATUS_THRESHOLDS['gold']:
            return 'silver'
        elif points < self.STATUS_THRESHOLDS['platinum']:
            return 'gold'
        else:
            return 'platinum'

    @property
    def current_status(self):
        """Вычисляет текущий уровень в реальном времени."""
        return self.get_status_by_points(self.total_points)

    def points_to_next_status(self):
        """
        Возвращает количество баллов, необходимых для достижения следующего статуса.
        Если статус максимальный, возвращает 0.
        """
        current_points = self.total_points
        current_status = self.current_status

        # Определяем следующий статус
        if current_status == 'silver':
            next_threshold = self.STATUS_THRESHOLDS['gold']
        elif current_status == 'gold':
            next_threshold = self.STATUS_THRESHOLDS['platinum']
        else:  # platinum
            return 0

        needed = next_threshold - current_points
        return max(0, round(needed, 2))

    def save(self, *args, **kwargs):
        """При сохранении обновляем статус, если он изменился."""
        new_status = self.current_status

        if self.status != new_status:
            self.status = new_status
            self.last_status_update = timezone.now()

        super().save(*args, **kwargs)