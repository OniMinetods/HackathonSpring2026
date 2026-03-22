from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Privilege
from .serializers import PrivilegeSerializer


class PrivilegeListView(APIView):
    """
    Эндпоинт для получения всех привилегий
    """
    
    def get(self, request):
        privileges = Privilege.objects.all()
        serializer = PrivilegeSerializer(privileges, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)