from django.db import models
from django.conf import settings


class Level(models.Model):
    name = models.CharField('Название', max_length=50)
    slug = models.SlugField(unique=True)
    min_points = models.FloatField('Минимальное количество баллов')

    description = models.TextField('Описание', blank=True)
    financial_effect = models.DecimalField('Финансовый эффект (руб/год)', max_digits=12, decimal_places=2, default=0)
    mortgage_savings = models.DecimalField('Экономия по ипотеке', max_digits=12, decimal_places=2, default=0)
    cashback = models.DecimalField('Кэшбэк', max_digits=12, decimal_places=2, default=0)
    insurance_value = models.DecimalField('Стоимость ДМС', max_digits=12, decimal_places=2, default=0)

    badge_image = models.ImageField('Изображение бейджа', upload_to='badges/', blank=True)
    color_code = models.CharField('Цветовой код', max_length=20, default='#C0C0C0')

    class Meta:
        verbose_name = 'Уровень'
        verbose_name_plural = 'Уровни'
        ordering = ['min_points']

    def __str__(self):
        return self.name


class Privilege(models.Model):
    STATUS_CHOICES = [
        ('active', 'Активна'),
        ('locked', 'Заблокирована'),
        ('upcoming', 'Откроется при след. уровне'),
    ]

    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='privileges')
    title = models.CharField('Название', max_length=200)
    description = models.TextField('Описание')
    financial_effect = models.DecimalField('Финансовый эффект (руб)', max_digits=12, decimal_places=2, default=0)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='locked')
    icon = models.ImageField('Иконка', upload_to='privileges/', blank=True)

    class Meta:
        verbose_name = 'Привилегия'
        verbose_name_plural = 'Привилегии'

    def __str__(self):
        return f'{self.level.name}: {self.title}'


class Deal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='deals')
    date = models.DateField('Дата сделки', auto_now_add=True)
    amount = models.DecimalField('Сумма кредита', max_digits=15, decimal_places=2)
    additional_products = models.IntegerField('Количество доп. продуктов', default=0)
    is_financed = models.BooleanField('Профинансировано', default=True)

    class Meta:
        verbose_name = 'Сделка'
        verbose_name_plural = 'Сделки'

    def __str__(self):
        return f'{self.user} - {self.amount} ₽'


class DailyResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='daily_results')
    date = models.DateField('Дата', auto_now_add=True)
    deals_count = models.IntegerField('Оформлено сделок за день', default=0)
    volume = models.DecimalField('Объём кредитов за день', max_digits=15, decimal_places=2, default=0)
    additional_products = models.IntegerField('Оформлено доп. продуктов', default=0)

    class Meta:
        verbose_name = 'Результат дня'
        verbose_name_plural = 'Результаты дня'
        unique_together = ['user', 'date']


class Task(models.Model):
    TASK_TYPE_CHOICES = [
        ('deal', 'Сделка'),
        ('volume', 'Объём'),
        ('share', 'Доля банка'),
        ('product', 'Доп. продукт'),
    ]

    title = models.CharField('Название', max_length=200)
    description = models.TextField('Описание')
    task_type = models.CharField('Тип задачи', max_length=20, choices=TASK_TYPE_CHOICES)
    target_value = models.FloatField('Целевое значение')
    reward_points = models.FloatField('Награда (баллы)')
    deadline_days = models.IntegerField('Дедлайн (дней)', default=30)
    is_active = models.BooleanField('Активна', default=True)

    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'

    def __str__(self):
        return self.title


class UserTask(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'В процессе'),
        ('completed', 'Выполнена'),
        ('expired', 'Просрочена'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='user_tasks')
    current_value = models.FloatField('Текущее значение', default=0)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='in_progress')
    started_at = models.DateTimeField('Дата начала', auto_now_add=True)
    completed_at = models.DateTimeField('Дата выполнения', null=True, blank=True)

    class Meta:
        verbose_name = 'Задача пользователя'
        verbose_name_plural = 'Задачи пользователей'
        unique_together = ['user', 'task']

    @property
    def progress_percent(self):
        if self.task.target_value > 0:
            return min(100, (self.current_value / self.task.target_value) * 100)
        return 0

    def __str__(self):
        return f'{self.user}: {self.task.title} - {self.progress_percent:.0f}%'


class Rating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ratings')
    date = models.DateField('Дата расчёта', auto_now_add=True)
    total_points = models.FloatField('Общее количество баллов', default=0)
    volume_points = models.FloatField('Баллы за объём', default=0)
    deals_points = models.FloatField('Баллы за сделки', default=0)
    share_points = models.FloatField('Баллы за долю банка', default=0)
    dealer_rank = models.IntegerField('Место внутри дилера', null=True, blank=True)
    region_rank = models.IntegerField('Место в регионе', null=True, blank=True)
    global_rank = models.IntegerField('Место в общем рейтинге', null=True, blank=True)

    class Meta:
        verbose_name = 'Рейтинг'
        verbose_name_plural = 'Рейтинги'
        ordering = ['-date', '-total_points']
        unique_together = ['user', 'date']


class News(models.Model):
    title = models.CharField('Заголовок', max_length=200)
    content = models.TextField('Содержание')
    image = models.ImageField('Изображение', upload_to='news/', blank=True)
    link = models.URLField('Ссылка', blank=True)
    is_published = models.BooleanField('Опубликовано', default=True)
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)

    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class TrainingModule(models.Model):
    title = models.CharField('Название', max_length=200)
    description = models.TextField('Описание', blank=True)
    is_video = models.BooleanField('Видеоурок', default=False)
    video_url = models.URLField('Ссылка на видео', blank=True)
    content = models.TextField('Текст материала', blank=True)
    reward_points = models.FloatField('Баллы за прохождение', default=10)
    order = models.IntegerField('Порядок', default=0)

    class Meta:
        verbose_name = 'Обучающий модуль'
        verbose_name_plural = 'Обучающие модули'
        ordering = ['order']

    def __str__(self):
        return self.title


class TrainingTest(models.Model):
    module = models.ForeignKey(TrainingModule, on_delete=models.CASCADE, related_name='tests')
    question = models.TextField('Вопрос')
    correct_answer = models.CharField('Правильный ответ', max_length=500)

    class Meta:
        verbose_name = 'Вопрос теста'
        verbose_name_plural = 'Вопросы тестов'

    def __str__(self):
        return f'{self.module.title}: {self.question[:50]}'


class UserTraining(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trainings')
    module = models.ForeignKey(TrainingModule, on_delete=models.CASCADE, related_name='user_trainings')
    is_completed = models.BooleanField('Пройден', default=False)
    completed_at = models.DateTimeField('Дата прохождения', null=True, blank=True)
    test_score = models.IntegerField('Результат теста', default=0)
    earned_points = models.FloatField('Получено баллов', default=0)

    class Meta:
        verbose_name = 'Обучение пользователя'
        verbose_name_plural = 'Обучение пользователей'
        unique_together = ['user', 'module']


class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новое'),
        ('in_progress', 'В работе'),
        ('resolved', 'Решено'),
        ('closed', 'Закрыто'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_tickets')
    subject = models.CharField('Тема', max_length=200)
    message = models.TextField('Сообщение')
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)
    admin_response = models.TextField('Ответ администратора', blank=True)

    class Meta:
        verbose_name = 'Обращение'
        verbose_name_plural = 'Обращения'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user}: {self.subject}'


class SupportMessage(models.Model):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField('Сообщение')
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    is_from_support = models.BooleanField('От поддержки', default=False)

    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'
        ordering = ['created_at']


class Bonus(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bonuses')
    amount = models.DecimalField('Сумма', max_digits=12, decimal_places=2)
    description = models.TextField('Описание')
    created_at = models.DateTimeField('Дата начисления', auto_now_add=True)

    class Meta:
        verbose_name = 'Бонус'
        verbose_name_plural = 'Бонусы'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user}: {self.amount} ₽'