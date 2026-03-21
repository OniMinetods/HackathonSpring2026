from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .models import User, MonthlyPlan, Application, MonthlyRating
from .serializers import *


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet для управления пользователями."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Ограничивает список пользователей:
        - администраторы видят всех
        - обычные пользователи видят только себя.
        """
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get', 'put'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        GET: возвращает профиль текущего пользователя.
        PUT: обновляет профиль текущего пользователя.
        """
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(self.get_serializer(request.user).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginViewSet(viewsets.ViewSet):
    """ViewSet для аутентификации."""
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Аутентифицирует пользователя по username/password,
        возвращает токен и данные пользователя.
        """
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Удаляет токен пользователя (выход)."""
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully'})


class MonthlyPlanViewSet(viewsets.ModelViewSet):
    """ViewSet для месячных планов."""
    serializer_class = MonthlyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Ограничивает доступ к планам: администраторы видят все, обычные – только свои."""
        if self.request.user.is_staff:
            return MonthlyPlan.objects.all()
        return MonthlyPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """При создании плана назначает текущего пользователя."""
        serializer.save(user=self.request.user)


class ApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet для заявок на кредит."""
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Возвращает только заявки текущего пользователя."""
        return Application.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """При создании заявки назначает текущего пользователя."""
        serializer.save(user=self.request.user)


class MonthlyRatingViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для чтения месячных рейтингов."""
    serializer_class = MonthlyRatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Возвращает только рейтинги текущего пользователя."""
        return MonthlyRating.objects.filter(user=self.request.user)