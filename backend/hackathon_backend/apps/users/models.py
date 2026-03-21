from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
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
    dealer_name = models.CharField('Название ДЦ', max_length=200, blank=True)
    position = models.CharField('Должность', max_length=20, choices=ROLE_CHOICES, default='manager')
    phone = models.CharField('Телефон', max_length=20, blank=True)
    level = models.CharField('Уровень привилегии', max_length=20, choices=LEVEL_CHOICES, default='silver')
    registration_date = models.DateTimeField('Дата регистрации', auto_now_add=True)
    sber_id = models.CharField('Sber ID', max_length=100, blank=True)

    volume_points = models.FloatField('Баллы за объём', default=0)
    deals_points = models.FloatField('Баллы за сделки', default=0)
    share_points = models.FloatField('Баллы за долю банка', default=0)

    total_deals = models.IntegerField('Всего сделок', default=0)
    total_volume = models.DecimalField('Общий объём', max_digits=15, decimal_places=2, default=0)
    bank_share = models.FloatField('Доля банка в портфеле', default=0)

    is_blocked = models.BooleanField('Заблокирован', default=False)
    block_reason = models.TextField('Причина блокировки', blank=True)

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    @property
    def total_points(self):
        return self.volume_points + self.deals_points + self.share_points

    def __str__(self):
        return f'{self.last_name} {self.first_name}'