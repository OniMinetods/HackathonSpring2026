from rest_framework import serializers
from .models import User, MonthlyPlan, Application, MonthlyRating


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для модели User."""
    total_points = serializers.ReadOnlyField(source='current_month_points')
    full_name = serializers.SerializerMethodField()
    current_month_rating = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 'patronymic', 'full_name',
            'email', 'phone', 'dealer_code', 'position', 'level',
            'registration_date', 'sber_id', 'total_points',
            'total_deals', 'total_volume', 'bank_share', 'is_blocked',
            'current_month_points', 'current_month_rating'
        ]
        read_only_fields = ['id', 'registration_date', 'total_points', 'current_month_rating']

    def get_full_name(self, obj):
        """Возвращает ФИО пользователя."""
        if obj.patronymic:
            return f"{obj.last_name} {obj.first_name} {obj.patronymic}"
        return f"{obj.last_name} {obj.first_name}"

    def get_current_month_rating(self, obj):
        """Возвращает последний рассчитанный месячный рейтинг пользователя."""
        last_rating = obj.monthly_ratings.order_by('-year', '-month').first()
        if last_rating:
            return MonthlyRatingSerializer(last_rating).data
        return None


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления профиля пользователя."""
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'patronymic', 'email', 'phone']


class MonthlyPlanSerializer(serializers.ModelSerializer):
    """Сериализатор для MonthlyPlan. Поле user только для чтения."""
    class Meta:
        model = MonthlyPlan
        fields = '__all__'
        read_only_fields = ['user']


class ApplicationSerializer(serializers.ModelSerializer):
    """Сериализатор для Application. Поле user только для чтения."""
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['user']


class MonthlyRatingSerializer(serializers.ModelSerializer):
    """Сериализатор для MonthlyRating с добавлением имени пользователя."""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = MonthlyRating
        fields = '__all__'