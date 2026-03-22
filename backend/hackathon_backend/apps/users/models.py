from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta, date
import calendar


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

    sber_id = models.CharField('Sber ID', max_length=100, blank=True)

    volume_of_transactions = models.FloatField('Объём сделок', default=0)
    number_of_transactions = models.FloatField('Количество сделок', default=0)
    bank_share = models.FloatField('Доля банка в портфеле', default=0)
    conversion_rate = models.IntegerField('Одобрено заявок', default=0)

    volume_of_transactions_plan = models.FloatField('Объём сделок ПЛАН', default=10)
    number_of_transactions_plan = models.FloatField('Количество сделок ПЛАН', default=10)
    bank_share_plan = models.FloatField('Доля банка в портфеле ПЛАН', default=50)
    conversion_rate_plan = models.IntegerField('Подано заявок', default=70)

    volume_points = models.IntegerField('Баллы за объём сделок', default=0)
    deals_points = models.IntegerField('Баллы за количество сделок', default=0)
    share_points = models.IntegerField('Баллы за долю банка', default=0)
    conversion_points = models.IntegerField('Баллы за конверсию', default=0)

    last_status_update = models.DateTimeField('Дата последнего обновления уровня', blank=True, null=True)

    # Поля для отслеживания месяцев в статусах за текущий год
    months_silver_current_year = models.IntegerField('Месяцев в статусе Silver в текущем году', default=0)
    months_gold_current_year = models.IntegerField('Месяцев в статусе Gold в текущем году', default=0)
    months_platinum_current_year = models.IntegerField('Месяцев в статусе Platinum в текущем году', default=0)

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
        """Возвращает общий балл и все компоненты."""
        vol_part = self._safe_divide(
            self.volume_of_transactions,
            self.volume_of_transactions_plan
        ) * 0.35

        deals_part = self._safe_divide(
            self.number_of_transactions,
            self.number_of_transactions_plan
        ) * 0.25

        share_part = self._safe_divide(
            self.bank_share,
            self.bank_share_plan
        ) * 0.25

        conv_part = self._safe_divide(
            self.conversion_rate,
            self.conversion_rate_plan
        ) * 0.15

        total = vol_part + deals_part + share_part + conv_part

        # Обновляем поля в объекте (опционально)
        self.volume_points = round(vol_part, 2)
        self.deals_points = round(deals_part, 2)
        self.share_points = round(share_part, 2)
        self.conversion_points = round(conv_part, 2)

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

    @staticmethod
    def _months_between(start_date, end_date):
        """
        Возвращает количество полных календарных месяцев между двумя датами.
        """
        if start_date > end_date:
            return 0

        # Преобразуем datetime в date, если необходимо
        if hasattr(start_date, 'date'):
            start_date = start_date.date()
        if hasattr(end_date, 'date'):
            end_date = end_date.date()

        months = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)

        # Если день окончания меньше дня начала, вычитаем один неполный месяц
        if end_date.day < start_date.day:
            months -= 1

        return max(0, months)

    def _add_months_for_period(self, start_date, end_date, status):
        """
        Добавляет количество месяцев, проведённых в указанном статусе,
        только за период, попадающий в текущий год.
        """
        current_year = timezone.now().year

        # Преобразуем datetime в date, если необходимо
        if hasattr(start_date, 'date'):
            start_date = start_date.date()
        if hasattr(end_date, 'date'):
            end_date = end_date.date()

        # Обрезаем период по границам текущего года
        year_start = date(current_year, 1, 1)
        year_end = date(current_year, 12, 31)

        effective_start = max(start_date, year_start)
        effective_end = min(end_date, year_end)

        if effective_start > effective_end:
            return

        months = self._months_between(effective_start, effective_end)
        if months <= 0:
            return

        if status == 'silver':
            self.months_silver_current_year += months
        elif status == 'gold':
            self.months_gold_current_year += months
        elif status == 'platinum':
            self.months_platinum_current_year += months

    def monthly_status_update(self, check_date=None):
        """
        Выполняет ежемесячное обновление статуса пользователя.
        Если check_date не указан, используется текущая дата.
        """
        if check_date is None:
            now = timezone.now().date()
        else:
            if hasattr(check_date, 'date'):
                now = check_date.date()
            else:
                now = check_date

        # Если дата последнего обновления не установлена, используем дату регистрации
        if self.last_status_update is None:
            if hasattr(self, 'date_joined') and self.date_joined:
                if hasattr(self.date_joined, 'date'):
                    self.last_status_update = self.date_joined.date()
                else:
                    self.last_status_update = self.date_joined
            else:
                self.last_status_update = now

        last_date = self.last_status_update
        if hasattr(last_date, 'date'):
            last_date = last_date.date()

        if last_date > now:
            return  # некорректные даты

        # Проверяем, прошёл ли хотя бы один полный календарный месяц
        months_passed = self._months_between(last_date, now)
        if months_passed == 0:
            return  # обновление ещё не требуется

        # Добавляем месяцы, проведённые в текущем статусе за прошедший период
        self._add_months_for_period(last_date, now, self.status)

        # Пересчитываем статус на основе текущих баллов
        new_status = self.current_status
        if new_status != self.status:
            self.status = new_status

        # Обновляем дату последнего обновления
        self.last_status_update = now
        self.save(update_fields=[
            'status', 'last_status_update',
            'months_silver_current_year', 'months_gold_current_year', 'months_platinum_current_year'
        ])

    def reset_yearly_status_months(self):
        """
        Сбрасывает счетчики месяцев для нового года.
        Эту функцию нужно вызывать в начале каждого года (например, 1 января).
        """
        self.months_silver_current_year = 0
        self.months_gold_current_year = 0
        self.months_platinum_current_year = 0
        self.save(update_fields=[
            'months_silver_current_year',
            'months_gold_current_year',
            'months_platinum_current_year'
        ])

    def save(self, *args, **kwargs):
        """
        Сохраняет пользователя без автоматического обновления статуса.
        Обновление статуса происходит только через monthly_status_update.
        """
        super().save(*args, **kwargs)