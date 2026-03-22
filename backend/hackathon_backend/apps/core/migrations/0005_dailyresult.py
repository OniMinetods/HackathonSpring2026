# Generated manually

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0004_privilege_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailyResult',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                ('date', models.DateField(db_index=True, verbose_name='Дата')),
                (
                    'deals_count',
                    models.PositiveIntegerField(
                        default=0,
                        verbose_name='Оформлено сделок за день, шт.',
                    ),
                ),
                (
                    'credit_volume_million',
                    models.DecimalField(
                        decimal_places=3,
                        default=0,
                        max_digits=12,
                        verbose_name='Объём кредитов за день, млн ₽',
                    ),
                ),
                (
                    'extra_products_count',
                    models.PositiveIntegerField(
                        default=0,
                        verbose_name='Оформлено доп. продуктов за день, шт.',
                    ),
                ),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                (
                    'user',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='daily_results',
                        to=settings.AUTH_USER_MODEL,
                        verbose_name='Пользователь',
                    ),
                ),
            ],
            options={
                'verbose_name': 'Результат дня',
                'verbose_name_plural': 'Результаты дня',
            },
        ),
        migrations.AddConstraint(
            model_name='dailyresult',
            constraint=models.UniqueConstraint(
                fields=('user', 'date'),
                name='core_dailyresult_user_date_uniq',
            ),
        ),
    ]
