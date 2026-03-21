from rest_framework import serializers
from django.db.models import Sum, Count
from django.contrib.auth import get_user_model
from .models import (
    Level, Privilege, Deal, DailyResult, Task, UserTask,
    Rating, News, TrainingModule, TrainingTest, UserTraining,
    SupportTicket, SupportMessage, Bonus
)

User = get_user_model()


# ============= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РАСЧЕТА =============

def get_level_by_score(score):
    """
    Определение уровня на основе балла результативности.
    Пороги уровней:
    - Silver: 0-70 баллов
    - Gold: 70-90 баллов
    - Black: 90+ баллов
    """
    if score >= 90:
        return {'slug': 'platinum', 'name': 'Black', 'min_points': 90}
    elif score >= 70:
        return {'slug': 'gold', 'name': 'Gold', 'min_points': 70}
    else:
        return {'slug': 'silver', 'name': 'Silver', 'min_points': 0}


def calculate_performance_score(user):
    """
    Расчет балла результативности по формуле:
    0,35 * индекс объема + 0,25 * индекс количества сделок +
    0,25 * индекс доли банка + 0,15 * конверсия
    """
    # 1. Индекс объема: (факт/план) * 100, ограничение макс = 120
    volume_plan = user.volume_of_transactions_plan if user.volume_of_transactions_plan > 0 else 1
    volume_index = min((user.volume_of_transactions / volume_plan) * 100, 120)

    # 2. Индекс количества сделок: (факт/план) * 100
    deals_plan = user.number_of_transactions_plan if user.number_of_transactions_plan > 0 else 1
    deals_index = (user.number_of_transactions / deals_plan) * 100

    # 3. Индекс доли банка: (фактическая доля / целевая доля) * 100
    share_plan = user.bank_share_plan if user.bank_share_plan > 0 else 1
    share_index = (user.bank_share / share_plan) * 100

    # 4. Конверсия: (одобрено заявок / подано заявок) * 100
    conversion_rate = user.conversion_rate

    # Применение весовых коэффициентов
    volume_score = 0.35 * volume_index
    deals_score = 0.25 * deals_index
    share_score = 0.25 * share_index
    conversion_score = 0.15 * conversion_rate

    total_score = volume_score + deals_score + share_score + conversion_score

    return {
        'total_score': total_score,
        'breakdown': {
            'volume_index': volume_index,
            'volume_score': volume_score,
            'deals_index': deals_index,
            'deals_score': deals_score,
            'share_index': share_index,
            'share_score': share_score,
            'conversion_rate': conversion_rate,
            'conversion_score': conversion_score,
            'weights': {
                'volume': 0.35,
                'deals': 0.25,
                'share': 0.25,
                'conversion': 0.15
            }
        }
    }


# ============= СЕРИАЛИЗАТОРЫ =============

class LevelSerializer(serializers.ModelSerializer):
    """Сериализатор для уровней"""

    class Meta:
        model = Level
        fields = '__all__'


class PrivilegeSerializer(serializers.ModelSerializer):
    """Сериализатор для привилегий"""
    level_name = serializers.CharField(source='level.name', read_only=True)

    class Meta:
        model = Privilege
        fields = '__all__'


class DealSerializer(serializers.ModelSerializer):
    """Сериализатор для сделок"""

    class Meta:
        model = Deal
        fields = '__all__'
        read_only_fields = ['user', 'date']


class DailyResultSerializer(serializers.ModelSerializer):
    """Сериализатор для ежедневных результатов"""

    class Meta:
        model = DailyResult
        fields = '__all__'
        read_only_fields = ['user', 'date']


class TaskSerializer(serializers.ModelSerializer):
    """Сериализатор для задач"""

    class Meta:
        model = Task
        fields = '__all__'


class UserTaskSerializer(serializers.ModelSerializer):
    """Сериализатор для задач пользователя"""
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
    """Сериализатор для рейтинга"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_level = serializers.SerializerMethodField()  # Изменено для расчета уровня по баллам
    user_points = serializers.SerializerMethodField()  # Добавлено для отображения баллов

    class Meta:
        model = Rating
        fields = '__all__'

    def get_user_level(self, obj):
        """Получение уровня пользователя на основе его баллов"""
        score_data = calculate_performance_score(obj.user)
        level = get_level_by_score(score_data['total_score'])
        return level['slug']

    def get_user_points(self, obj):
        """Получение баллов пользователя"""
        score_data = calculate_performance_score(obj.user)
        return score_data['total_score']


class NewsSerializer(serializers.ModelSerializer):
    """Сериализатор для новостей"""

    class Meta:
        model = News
        fields = '__all__'


class TrainingModuleSerializer(serializers.ModelSerializer):
    """Сериализатор для модулей обучения"""
    is_completed = serializers.SerializerMethodField()
    user_score = serializers.SerializerMethodField()

    class Meta:
        model = TrainingModule
        fields = '__all__'

    def get_is_completed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserTraining.objects.filter(
                user=request.user, module=obj, is_completed=True
            ).exists()
        return False

    def get_user_score(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            training = UserTraining.objects.filter(
                user=request.user, module=obj
            ).first()
            return training.test_score if training else None
        return None


class TrainingTestSerializer(serializers.ModelSerializer):
    """Сериализатор для тестов обучения (без правильных ответов)"""

    class Meta:
        model = TrainingTest
        fields = ['id', 'module', 'question']  # Не включаем correct_answer


class TrainingCompleteSerializer(serializers.Serializer):
    """Сериализатор для завершения модуля обучения"""
    module_id = serializers.IntegerField()
    answers = serializers.DictField(child=serializers.CharField())


class UserTrainingSerializer(serializers.ModelSerializer):
    """Сериализатор для прогресса обучения пользователя"""
    module_title = serializers.CharField(source='module.title', read_only=True)
    module_reward_points = serializers.FloatField(source='module.reward_points', read_only=True)

    class Meta:
        model = UserTraining
        fields = '__all__'
        read_only_fields = ['user', 'completed_at', 'earned_points']


class SupportTicketSerializer(serializers.ModelSerializer):
    """Сериализатор для обращений в поддержку"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicket
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at', 'updated_at', 'admin_response']

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'message': last_msg.message,
                'created_at': last_msg.created_at,
                'is_from_support': last_msg.is_from_support
            }
        return None


class SupportMessageSerializer(serializers.ModelSerializer):
    """Сериализатор для сообщений в поддержке"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = SupportMessage
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'is_from_support']


class BonusSerializer(serializers.ModelSerializer):
    """Сериализатор для бонусов"""

    class Meta:
        model = Bonus
        fields = '__all__'
        read_only_fields = ['user', 'created_at']


class DashboardSerializer(serializers.Serializer):
    """
    Сериализатор для дашборда пользователя
    Использует новую логику расчета баллов
    """
    user = serializers.SerializerMethodField()
    current_level = serializers.SerializerMethodField()
    next_level = serializers.SerializerMethodField()
    progress_to_next = serializers.FloatField()
    points_to_next = serializers.FloatField()
    today_stats = serializers.DictField()
    total_points = serializers.FloatField()
    points_breakdown = serializers.DictField()

    def get_user(self, obj):
        """Получение данных пользователя"""
        from apps.users.serializers import UserSerializer
        return UserSerializer(obj['user']).data if isinstance(obj, dict) else UserSerializer(obj.user).data

    def get_current_level(self, obj):
        """Получение текущего уровня на основе баллов"""
        if isinstance(obj, dict):
            user = obj.get('user')
        else:
            user = obj.user

        score_data = calculate_performance_score(user)
        level_info = get_level_by_score(score_data['total_score'])

        # Возвращаем объект уровня из базы данных, если существует
        try:
            level = Level.objects.filter(slug=level_info['slug']).first()
            if level:
                return LevelSerializer(level).data
        except:
            pass

        # Если уровня нет в БД, возвращаем словарь
        return level_info

    def get_next_level(self, obj):
        """Получение следующего уровня"""
        if isinstance(obj, dict):
            user = obj.get('user')
        else:
            user = obj.user

        score_data = calculate_performance_score(user)
        total_score = score_data['total_score']

        if total_score < 70:
            next_slug = 'gold'
        elif total_score < 90:
            next_slug = 'black'
        else:
            return None

        try:
            level = Level.objects.filter(slug=next_slug).first()
            if level:
                return LevelSerializer(level).data
        except:
            pass

        return {'slug': next_slug, 'name': next_slug.capitalize(), 'min_points': 70 if next_slug == 'gold' else 90}


class FinancialEffectSerializer(serializers.Serializer):
    """
    Сериализатор для финансового эффекта
    Учитывает уровень пользователя на основе баллов
    """
    total_bonuses = serializers.DecimalField(max_digits=12, decimal_places=2)
    level_benefit = serializers.DecimalField(max_digits=12, decimal_places=2)
    mortgage_savings = serializers.DecimalField(max_digits=12, decimal_places=2)
    cashback = serializers.DecimalField(max_digits=12, decimal_places=2)
    insurance_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_benefit = serializers.DecimalField(max_digits=12, decimal_places=2)
    current_level = serializers.SerializerMethodField()

    def get_current_level(self, obj):
        """Получение текущего уровня на основе баллов"""
        if isinstance(obj, dict):
            user = obj.get('user') if 'user' in obj else None
        else:
            user = getattr(obj, 'user', None)

        if user:
            score_data = calculate_performance_score(user)
            level_info = get_level_by_score(score_data['total_score'])
            return level_info
        return obj.get('current_level')


class RatingTopSerializer(serializers.Serializer):
    """
    Сериализатор для топа рейтинга
    Включает баллы, рассчитанные по новой формуле
    """
    dealer_top = serializers.ListField()
    dealer_rank = serializers.IntegerField(allow_null=True)
    region_top = serializers.ListField()
    region_rank = serializers.IntegerField(allow_null=True)
    global_top = serializers.ListField()
    global_rank = serializers.IntegerField(allow_null=True)


class CalculatorRequestSerializer(serializers.Serializer):
    """
    Сериализатор для запроса калькулятора
    """
    additional_deals = serializers.IntegerField(min_value=0, default=0)
    additional_volume = serializers.FloatField(min_value=0, default=0)
    additional_share = serializers.FloatField(min_value=0, default=0)
    additional_products = serializers.IntegerField(min_value=0, default=0)


class CalculatorResponseSerializer(serializers.Serializer):
    """
    Сериализатор для ответа калькулятора
    Использует новую формулу расчета баллов
    """
    new_total_points = serializers.FloatField()
    new_level = serializers.SerializerMethodField()
    financial_effect = serializers.DecimalField(max_digits=12, decimal_places=2)
    additional_deals = serializers.IntegerField()
    additional_volume = serializers.FloatField()
    additional_share = serializers.FloatField()
    additional_products = serializers.IntegerField()
    current_total_points = serializers.FloatField(required=False, default=0)

    def get_new_level(self, obj):
        """Получение уровня на основе нового балла"""
        if isinstance(obj, dict):
            total_points = obj.get('new_total_points', 0)
            level_info = get_level_by_score(total_points)

            # Пытаемся получить объект уровня из БД
            try:
                level = Level.objects.filter(slug=level_info['slug']).first()
                if level:
                    return LevelSerializer(level).data
            except:
                pass

            return level_info
        return obj.get('new_level')


class UserPerformanceSerializer(serializers.Serializer):
    """
    Сериализатор для отображения результативности пользователя
    """
    user_id = serializers.IntegerField()
    user_name = serializers.CharField()
    dealer_code = serializers.CharField()

    # Показатели
    volume_fact = serializers.FloatField()
    volume_plan = serializers.FloatField()
    volume_index = serializers.FloatField()
    volume_score = serializers.FloatField()

    deals_fact = serializers.FloatField()
    deals_plan = serializers.FloatField()
    deals_index = serializers.FloatField()
    deals_score = serializers.FloatField()

    share_fact = serializers.FloatField()
    share_plan = serializers.FloatField()
    share_index = serializers.FloatField()
    share_score = serializers.FloatField()

    conversion_rate = serializers.FloatField()
    conversion_score = serializers.FloatField()

    total_score = serializers.FloatField()
    level = serializers.SerializerMethodField()

    def get_level(self, obj):
        """Получение уровня на основе общего балла"""
        if isinstance(obj, dict):
            total_score = obj.get('total_score', 0)
        else:
            total_score = obj.total_score

        level_info = get_level_by_score(total_score)
        return level_info['slug']