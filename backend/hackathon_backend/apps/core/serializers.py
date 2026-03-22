from rest_framework import serializers
from .models import DailyResult, Privilege


class PrivilegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Privilege
        fields = ('name', 'short_description', 'financial_effect_rub', 'role')


class ScenarioCalculatorInputSerializer(serializers.Serializer):
    """Текущий рейтинг с клиента + ползунки сценария."""

    total_points = serializers.FloatField(min_value=0, max_value=500)
    extra_deals = serializers.IntegerField(
        required=False, min_value=0, max_value=100, default=0
    )
    extra_volume_million = serializers.FloatField(
        required=False, min_value=0, max_value=500, default=0
    )
    extra_share_steps = serializers.IntegerField(
        required=False, min_value=0, max_value=20, default=0
    )
    extra_products = serializers.IntegerField(
        required=False, min_value=0, max_value=100, default=0
    )

    def validate_extra_volume_million(self, value):
        return round(float(value), 4)


class DailyResultSerializer(serializers.ModelSerializer):
    date = serializers.DateField(read_only=True)

    class Meta:
        model = DailyResult
        fields = (
            'date',
            'deals_count',
            'credit_volume_million',
            'extra_products_count',
            'updated_at',
        )
        read_only_fields = ('updated_at',)