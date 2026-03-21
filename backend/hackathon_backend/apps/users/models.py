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

    volume_of_transactions = models.FloatField('Объём сделок в рублях', default=0)
    number_of_transactions = models.FloatField('Количество сделок', default=0)
    bank_share= models.FloatField('Доля банка в портфеле', default=0)
    conversion_rate = models.IntegerField('Конверсия', default=0)

    volume_of_transactions_plan = models.FloatField('Объём сделок в рублях ПЛАН', default=10)
    number_of_transactions_plan = models.FloatField('Количество сделок ПЛАН', default=10)
    bank_share_plan = models.FloatField('Доля банка в портфеле ПЛАН', default=50)
    conversion_rate_plan = models.IntegerField('Конверсия ПЛАН', default=70)


    is_blocked = models.BooleanField('Заблокирован', default=False)
    block_reason = models.TextField('Причина блокировки', blank=True)

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    # @property
    # def total_points(self):
    #     """Суммарное количество баллов пользователя (за объём, сделки и долю)."""
    #     return self.volume_points + self.deals_points + self.share_points

    def __str__(self):
        """Возвращает ФИО пользователя."""
        return f'{self.last_name} {self.first_name} {self.patronymic}'
