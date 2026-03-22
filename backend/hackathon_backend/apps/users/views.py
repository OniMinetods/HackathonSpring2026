from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
import logging

from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User
from .monthly import apply_monthly_status_credits
from .rating import build_dealer_center_rating
from .serializers import UserSerializer, UserProfileUpdateSerializer

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.GenericViewSet):
    """ViewSet только для получения и обновления профиля"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get', 'patch'], url_path='profile', url_name='profile')
    def profile(self, request):
        """Получение или обновление профиля"""
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)

        elif request.method == 'PATCH':
            serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(self.get_serializer(request.user).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {'error': 'Method not allowed'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    @action(
        detail=False,
        methods=['get'],
        url_path='rating/dealer-center',
        url_name='rating-dealer-center',
    )
    def rating_dealer_center(self, request):
        """Топ-10 внутри ДЦ по total_points; топ дилерских центров по сумме баллов."""
        return Response(build_dealer_center_rating(request.user))

class LoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            try:
                apply_monthly_status_credits(user.pk)
                user.refresh_from_db()
            except Exception:
                logger.exception('apply_monthly_status_credits on login failed')
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully'})