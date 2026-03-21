from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Модель пользователя, расширяющая стандартную модель Django."""
    ROLE_CHOICES = [
        ('cso', 'КСО'),
        ('manager', 'Менеджер'),
        ('rop', 'РОП'),
        ('director', 'Директор'),
    ]

    LEVEL_CHOICES = [
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('black', 'Black'),
    ]
    patronymic = models.CharField('Отчество', max_length=150, blank=True)
    dealer_code = models.CharField('Код ДЦ', max_length=50, blank=True)
    position = models.CharField('Должность', max_length=20, choices=ROLE_CHOICES, default='manager')
    phone = models.CharField('Телефон', max_length=20, blank=True)
    level = models.CharField('Уровень привилегии', max_length=20, choices=LEVEL_CHOICES, default='silver')
    registration_date = models.DateTimeField('Дата регистрации', auto_now_add=True)
    sber_id = models.CharField('Sber ID', max_length=100, blank=True)

    #volume_points = models.FloatField('Баллы за объём', default=0)
    #deals_points = models.FloatField('Баллы за сделки', default=0)
    #share_points = models.FloatField('Баллы за долю банка', default=0)

    total_deals = models.IntegerField('Всего сделок', default=0)
    total_volume = models.DecimalField('Общий объём', max_digits=15, decimal_places=2, default=0)
    bank_share = models.FloatField('Доля банка в портфеле', default=0)

    is_blocked = models.BooleanField('Заблокирован', default=False)
    block_reason = models.TextField('Причина блокировки', blank=True)

    # Добавил Косолапов
    current_month_points = models.FloatField('Баллы за текущий месяц', default=0)
    last_month_rating = models.ForeignKey('MonthlyRating', on_delete=models.SET_NULL, null=True, blank=True,
                                          related_name='+')

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    @property
    def total_points(self):
        """Суммарное количество баллов пользователя (за объём, сделки и долю)."""
        return self.volume_points + self.deals_points + self.share_points

    def __str__(self):
        """Возвращает ФИО пользователя."""
        return f'{self.last_name} {self.first_name} {self.patronymic}'

##Добавил Косолапов

class MonthlyPlan(models.Model):
    """Плановые показатели для пользователя на месяц."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='plans')
    year = models.IntegerField('Год')
    month = models.IntegerField('Месяц (1-12)')
    volume_plan = models.DecimalField('План по объёму (млн ₽)', max_digits=15, decimal_places=2, default=0)
    deals_plan = models.IntegerField('План по количеству сделок', default=0)
    target_share = models.FloatField('Целевая доля банка (%)', default=50)
    conversion_plan = models.FloatField('План по конверсии (%)', default=70)

    class Meta:
        verbose_name = 'Месячный план'
        verbose_name_plural = 'Месячные планы'
        unique_together = ['user', 'year', 'month']

    def __str__(self):
        """Возвращает строку с пользователем и периодом."""
        return f'{self.user} — {self.month}/{self.year}'


class Application(models.Model):
    """Заявка на кредит (для расчёта конверсии)."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    date = models.DateField('Дата подачи')
    is_approved = models.BooleanField('Одобрена', default=False)
    # можно добавить сумму, тип кредита и т.д.

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'

    def __str__(self):
        """Возвращает строку с пользователем, датой и статусом одобрения."""
        return f'{self.user} — {self.date} {"одобрена" if self.is_approved else "не одобрена"}'


class MonthlyRating(models.Model):
    """Результат расчёта рейтинга за месяц."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='monthly_ratings')
    year = models.IntegerField('Год')
    month = models.IntegerField('Месяц (1-12)')

    volume_index = models.FloatField('Индекс объёма (0-120)')
    deals_index = models.FloatField('Индекс количества сделок (0-120)')
    share_index = models.FloatField('Индекс доли банка (0-120)')
    conversion_index = models.FloatField('Индекс конверсии (0-120)')
    total_points = models.FloatField('Итоговые баллы (0-120)')
    level = models.CharField('Уровень', max_length=20, choices=User.LEVEL_CHOICES)

    created_at = models.DateTimeField('Дата расчёта', auto_now_add=True)

    class Meta:
        verbose_name = 'Месячный рейтинг'
        verbose_name_plural = 'Месячные рейтинги'
        unique_together = ['user', 'year', 'month']
        ordering = ['-year', '-month']

    def __str__(self):
        """Возвращает строку с пользователем, периодом, баллами и уровнем."""
        return f'{self.user} — {self.month}/{self.year}: {self.total_points} баллов ({self.level})'