from django.conf import settings
from django.db import models


class Privilege(models.Model):
    class Role(models.TextChoices):
        SILVER = 'silver', 'Silver'
        GOLD = 'gold', 'Gold'
        PLATINUM = 'platinum', 'Platinum'

    name = models.CharField(
        max_length=200,
        default='Название',
        verbose_name='Название'
    )
    short_description = models.TextField(
        verbose_name='Краткое описание'
    )
    financial_effect_rub = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name='Финансовый эффект в рублях'
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.SILVER,
        verbose_name='Роль'
    )

    class Meta:
        verbose_name = 'Привилегия уровня'
        verbose_name_plural = 'Привилегии уровня'

    def __str__(self):
        return self.name


class DailyResult(models.Model):
    """Результаты рабочего дня сотрудника (одна запись на пользователя и дату)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='daily_results',
        verbose_name='Пользователь',
    )
    date = models.DateField('Дата', db_index=True)
    deals_count = models.PositiveIntegerField('Оформлено сделок за день, шт.', default=0)
    credit_volume_million = models.DecimalField(
        'Объём кредитов за день, млн ₽',
        max_digits=12,
        decimal_places=3,
        default=0,
    )
    extra_products_count = models.PositiveIntegerField(
        'Оформлено доп. продуктов за день, шт.',
        default=0,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Результат дня'
        verbose_name_plural = 'Результаты дня'
        constraints = [
            models.UniqueConstraint(
                fields=('user', 'date'),
                name='core_dailyresult_user_date_uniq',
            ),
        ]

    def __str__(self):
        return f'{self.user_id} {self.date}'
