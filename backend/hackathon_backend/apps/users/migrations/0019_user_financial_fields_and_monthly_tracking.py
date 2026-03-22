# Generated manually for financial effect + monthly tracking fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0018_user_last_points_update'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='months_year_tracker',
            field=models.IntegerField(
                blank=True,
                null=True,
                verbose_name='Год, для которого ведутся счётчики месяцев',
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='last_monthly_credit_ym',
            field=models.CharField(
                blank=True,
                max_length=7,
                null=True,
                verbose_name='Последний учтённый месяц (YYYY-MM)',
            ),
        ),
        # migrations.AddField(
        #     model_name='user',
        #     name='bonus_income_yearly_rub',
        #     field=models.PositiveIntegerField(
        #         default=0,
        #         verbose_name='Доп. доход от бонусов за год (₽)',
        #     ),
        # ),
        migrations.AddField(
            model_name='user',
            name='mortgage_savings_yearly_rub',
            field=models.PositiveIntegerField(
                default=0,
                verbose_name='Экономия по ипотеке за год (₽)',
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='cashback_yearly_rub',
            field=models.PositiveIntegerField(
                default=0,
                verbose_name='Кэшбэк за год (₽)',
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='dms_yearly_rub',
            field=models.PositiveIntegerField(
                default=0,
                verbose_name='ДМС стоимость за год (₽)',
            ),
        ),
    ]
