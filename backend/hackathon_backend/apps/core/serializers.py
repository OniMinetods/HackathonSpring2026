from rest_framework import serializers
from django.db.models import Sum, Count
from django.contrib.auth import get_user_model
from .models import (
    Level, Privilege, Deal, DailyResult, Task, UserTask,
    Rating, News, TrainingModule, TrainingTest, UserTraining,
    SupportTicket, SupportMessage, Bonus
)

User = get_user_model()


class LevelSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Level."""
    class Meta:
        model = Level
        fields = '__all__'


class PrivilegeSerializer(serializers.ModelSerializer):
    """Сериализатор для Privilege с добавлением названия уровня."""
    level_name = serializers.CharField(source='level.name', read_only=True)

    class Meta:
        model = Privilege
        fields = '__all__'


class DealSerializer(serializers.ModelSerializer):
    """Сериализатор для Deal. Поля user и date только для чтения."""
    class Meta:
        model = Deal
        fields = '__all__'
        read_only_fields = ['user', 'date']


class DailyResultSerializer(serializers.ModelSerializer):
    """Сериализатор для DailyResult. Поля user и date только для чтения."""
    class Meta:
        model = DailyResult
        fields = '__all__'
        read_only_fields = ['user', 'date']


class TaskSerializer(serializers.ModelSerializer):
    """Сериализатор для Task."""
    class Meta:
        model = Task
        fields = '__all__'


class UserTaskSerializer(serializers.ModelSerializer):
    """Сериализатор для UserTask с дополнительными полями из связанной задачи и процентом выполнения."""
    task_title = serializers.CharField(source='task.title', read_only=True)
    task_type = serializers.CharField(source='task.task_type', read_only=True)
    target_value = serializers.FloatField(source='task.target_value', read_only=True)
    reward_points = serializers.FloatField(source='task.reward_points', read_only=True)
    progress_percent = serializers.ReadOnlyField()

    class Meta:
        model = UserTask
        fields = '__all__'
        read_only_fields = ['user', 'started_at', 'completed_at']


class RatingSerializer(serializers.ModelSerializer):
    """Сериализатор для Rating с добавлением имени пользователя и его уровня."""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_level = serializers.CharField(source='user.level', read_only=True)

    class Meta:
        model = Rating
        fields = '__all__'


class NewsSerializer(serializers.ModelSerializer):
    """Сериализатор для News."""
    class Meta:
        model = News
        fields = '__all__'


class TrainingModuleSerializer(serializers.ModelSerializer):
    """Сериализатор для TrainingModule с вычисляемыми полями is_completed и user_score."""
    is_completed = serializers.SerializerMethodField()
    user_score = serializers.SerializerMethodField()

    class Meta:
        model = TrainingModule
        fields = '__all__'

    def get_is_completed(self, obj):
        """Возвращает, пройден ли модуль текущим пользователем."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserTraining.objects.filter(
                user=request.user, module=obj, is_completed=True
            ).exists()
        return False

    def get_user_score(self, obj):
        """Возвращает результат теста пользователя для модуля, если есть."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            training = UserTraining.objects.filter(
                user=request.user, module=obj
            ).first()
            return training.test_score if training else None
        return None


class TrainingTestSerializer(serializers.ModelSerializer):
    """Сериализатор для TrainingTest. Скрывает правильный ответ."""
    class Meta:
        model = TrainingTest
        fields = ['id', 'module', 'question']


class TrainingCompleteSerializer(serializers.Serializer):
    """Сериализатор для данных, отправляемых при завершении модуля."""
    module_id = serializers.IntegerField()
    answers = serializers.DictField(child=serializers.CharField())


class UserTrainingSerializer(serializers.ModelSerializer):
    """Сериализатор для UserTraining с добавлением названия модуля и баллов за прохождение."""
    module_title = serializers.CharField(source='module.title', read_only=True)
    module_reward_points = serializers.FloatField(source='module.reward_points', read_only=True)

    class Meta:
        model = UserTraining
        fields = '__all__'
        read_only_fields = ['user', 'completed_at', 'earned_points']


class SupportTicketSerializer(serializers.ModelSerializer):
    """Сериализатор для SupportTicket с добавлением имени пользователя и последнего сообщения."""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicket
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at', 'updated_at', 'admin_response']

    def get_last_message(self, obj):
        """Возвращает последнее сообщение в тикете."""
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'message': last_msg.message,
                'created_at': last_msg.created_at,
                'is_from_support': last_msg.is_from_support
            }
        return None


class SupportMessageSerializer(serializers.ModelSerializer):
    """Сериализатор для SupportMessage с добавлением имени автора."""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = SupportMessage
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'is_from_support']


class BonusSerializer(serializers.ModelSerializer):
    """Сериализатор для Bonus. Поля user и created_at только для чтения."""
    class Meta:
        model = Bonus
        fields = '__all__'
        read_only_fields = ['user', 'created_at']


class DashboardSerializer(serializers.Serializer):
    """Составной сериализатор для дашборда пользователя."""
    user = serializers.SerializerMethodField()
    current_level = LevelSerializer()
    next_level = LevelSerializer(allow_null=True)
    progress_to_next = serializers.FloatField()
    points_to_next = serializers.FloatField()
    today_stats = serializers.DictField()
    total_points = serializers.FloatField()
    points_breakdown = serializers.DictField()

    def get_user(self, obj):
        """Сериализует данные пользователя через UserSerializer из apps.users."""
        from apps.users.serializers import UserSerializer
        return UserSerializer(obj).data


class FinancialEffectSerializer(serializers.Serializer):
    """Сериализатор для финансового эффекта."""
    total_bonuses = serializers.DecimalField(max_digits=12, decimal_places=2)
    level_benefit = serializers.DecimalField(max_digits=12, decimal_places=2)
    mortgage_savings = serializers.DecimalField(max_digits=12, decimal_places=2)
    cashback = serializers.DecimalField(max_digits=12, decimal_places=2)
    insurance_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_benefit = serializers.DecimalField(max_digits=12, decimal_places=2)
    current_level = LevelSerializer(allow_null=True)


class RatingTopSerializer(serializers.Serializer):
    """Сериализатор для топов рейтинга."""
    dealer_top = serializers.ListField()
    dealer_rank = serializers.IntegerField(allow_null=True)
    region_top = serializers.ListField()
    region_rank = serializers.IntegerField(allow_null=True)
    global_top = serializers.ListField()
    global_rank = serializers.IntegerField(allow_null=True)


class CalculatorRequestSerializer(serializers.Serializer):
    """Валидация входных данных калькулятора."""
    additional_deals = serializers.IntegerField(min_value=0, default=0)
    additional_volume = serializers.FloatField(min_value=0, default=0)
    additional_share = serializers.FloatField(min_value=0, default=0)
    additional_products = serializers.IntegerField(min_value=0, default=0)


class CalculatorResponseSerializer(serializers.Serializer):
    """Сериализатор ответа калькулятора."""
    new_total_points = serializers.FloatField()
    new_level = LevelSerializer(allow_null=True)
    financial_effect = serializers.DecimalField(max_digits=12, decimal_places=2)
    additional_deals = serializers.IntegerField()
    additional_volume = serializers.FloatField()
    additional_share = serializers.FloatField()
    additional_products = serializers.IntegerField()