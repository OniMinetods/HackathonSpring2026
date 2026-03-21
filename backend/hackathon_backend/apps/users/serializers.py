from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    total_points = serializers.ReadOnlyField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 'patronymic', 'full_name',
            'email', 'phone', 'dealer_code', 'position', 'level',
            'registration_date', 'sber_id', 'total_points',
            'volume_of_transactions', 'number_of_transactions', 'bank_share', 'conversion_rate',
            'volume_of_transactions_plan', 'number_of_transactions_plan',
            'bank_share_plan', 'conversion_rate_plan',
            'is_blocked', 'block_reason'
        ]
        read_only_fields = ['id', 'registration_date', 'total_points']

    def get_full_name(self, obj):
        if obj.patronymic:
            return f"{obj.last_name} {obj.first_name} {obj.patronymic}"
        return f"{obj.last_name} {obj.first_name}"


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'patronymic', 'email', 'phone']