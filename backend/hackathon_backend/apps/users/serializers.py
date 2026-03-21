from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    total_points = serializers.FloatField(read_only=True)
    points_to_next_status = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['id', 'registration_date', 'total_points']

    def get_full_name(self, obj):
        if obj.patronymic:
            return f"{obj.last_name} {obj.first_name} {obj.patronymic}"
        return f"{obj.last_name} {obj.first_name}"

    def get_points_to_next_status(self, obj):
        """Возвращает количество баллов до следующего статуса."""
        return obj.points_to_next_status()

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'patronymic', 'email', 'phone']