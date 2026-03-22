from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    total_points = serializers.FloatField(read_only=True)
    points_to_next_status = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = [
            'id',
            'date_joined',
            'total_points',
            'bonus_income_yearly_rub',
            'mortgage_savings_yearly_rub',
            'cashback_yearly_rub',
            'dms_yearly_rub',
            'months_silver_current_year',
            'months_gold_current_year',
            'months_platinum_current_year',
            'months_year_tracker',
            'last_monthly_credit_ym',
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['total_financial_benefit_yearly_rub'] = (
            int(instance.bonus_income_yearly_rub)
            + int(instance.mortgage_savings_yearly_rub)
            + int(instance.cashback_yearly_rub)
            + int(instance.dms_yearly_rub)
        )
        return data

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