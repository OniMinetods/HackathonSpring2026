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