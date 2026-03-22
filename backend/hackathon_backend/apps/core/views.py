from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Privilege
from .serializers import PrivilegeSerializer, ScenarioCalculatorInputSerializer
from .scenario import scenario_calculate


class PrivilegeListView(APIView):
    """
    Эндпоинт для получения всех привилегий
    """

    def get(self, request):
        privileges = Privilege.objects.all()
        serializer = PrivilegeSerializer(privileges, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ScenarioCalculatorView(APIView):
    """
    Сценарный калькулятор: total_points с клиента + ползунки;
    на выходе — projected_total_points по той же логике, что User.total_points.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ScenarioCalculatorInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        kw = dict(serializer.validated_data)
        total_points = kw.pop('total_points')
        payload = scenario_calculate(request.user, total_points, **kw)
        return Response(payload, status=status.HTTP_200_OK)
