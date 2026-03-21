from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum, Count
from django.utils import timezone
from .models import (
    Level, Privilege, Deal, DailyResult, Task, UserTask,
    Rating, News, TrainingModule, TrainingTest, UserTraining,
    SupportTicket, SupportMessage, Bonus
)
from .serializers import (
    LevelSerializer, PrivilegeSerializer, DealSerializer, DailyResultSerializer,
    TaskSerializer, UserTaskSerializer, RatingSerializer, NewsSerializer,
    TrainingModuleSerializer, TrainingTestSerializer, TrainingCompleteSerializer,
    UserTrainingSerializer, SupportTicketSerializer, SupportMessageSerializer,
    BonusSerializer, DashboardSerializer, FinancialEffectSerializer,
    RatingTopSerializer, CalculatorRequestSerializer, CalculatorResponseSerializer
)


class LevelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [AllowAny]


class PrivilegeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PrivilegeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Privilege.objects.all()
        level = self.request.query_params.get('level')
        if level:
            queryset = queryset.filter(level__slug=level)
        return queryset


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_status(self, request):
        user = request.user
        levels = Level.objects.all()

        current_level = None
        next_level = None

        for level in levels:
            if user.total_points >= level.min_points:
                current_level = level
            else:
                if not next_level:
                    next_level = level
                break

        points_to_next = 0
        progress_to_next = 0
        if next_level:
            points_to_next = next_level.min_points - user.total_points
            prev_level = levels.filter(min_points__lt=next_level.min_points).last()
            if prev_level:
                range_points = next_level.min_points - prev_level.min_points
                progress_to_next = (user.total_points - prev_level.min_points) / range_points * 100
            else:
                progress_to_next = min(100, (user.total_points / next_level.min_points) * 100)

        today = timezone.now().date()
        today_deals = Deal.objects.filter(user=user, date=today).aggregate(
            deals_count=Count('id'),
            volume=Sum('amount')
        )
        today_products = Deal.objects.filter(user=user, date=today).aggregate(
            products=Sum('additional_products')
        )

        today_stats = {
            'deals_count': today_deals['deals_count'] or 0,
            'volume': today_deals['volume'] or 0,
            'additional_products': today_products['products'] or 0
        }

        points_breakdown = {
            'volume_points': user.volume_points,
            'deals_points': user.deals_points,
            'share_points': user.share_points
        }

        data = {
            'user': user,
            'current_level': current_level,
            'next_level': next_level,
            'progress_to_next': progress_to_next,
            'points_to_next': points_to_next,
            'today_stats': today_stats,
            'total_points': user.total_points,
            'points_breakdown': points_breakdown
        }

        serializer = DashboardSerializer(data)
        return Response(serializer.data)


class FinancialEffectViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_effect(self, request):
        user = request.user

        total_bonuses = Bonus.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0

        current_level = Level.objects.filter(min_points__lte=user.total_points).last()

        level_benefit = current_level.financial_effect if current_level else 0
        mortgage_savings = current_level.mortgage_savings if current_level else 0
        cashback = current_level.cashback if current_level else 0
        insurance_value = current_level.insurance_value if current_level else 0

        total_benefit = total_bonuses + level_benefit

        data = {
            'total_bonuses': total_bonuses,
            'level_benefit': level_benefit,
            'mortgage_savings': mortgage_savings,
            'cashback': cashback,
            'insurance_value': insurance_value,
            'total_benefit': total_benefit,
            'current_level': current_level
        }

        serializer = FinancialEffectSerializer(data)
        return Response(serializer.data)


class RatingViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_rating(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()

        user = request.user

        dealer_users = User.objects.filter(
            dealer_code=user.dealer_code,
            is_blocked=False
        ).order_by('-total_points')

        dealer_top = []
        dealer_rank = None
        for idx, u in enumerate(dealer_users[:10], 1):
            dealer_top.append({
                'id': u.id,
                'full_name': u.get_full_name(),
                'level': u.level,
                'total_points': u.total_points
            })
            if u.id == user.id:
                dealer_rank = idx

        all_users = User.objects.filter(is_blocked=False).order_by('-total_points')
        region_top = []
        region_rank = None
        for idx, u in enumerate(all_users[:10], 1):
            region_top.append({
                'id': u.id,
                'full_name': u.get_full_name(),
                'level': u.level,
                'dealer_name': u.dealer_name,
                'total_points': u.total_points
            })
            if u.id == user.id:
                region_rank = idx

        global_top = region_top
        global_rank = region_rank

        data = {
            'dealer_top': dealer_top,
            'dealer_rank': dealer_rank,
            'region_top': region_top,
            'region_rank': region_rank,
            'global_top': global_top,
            'global_rank': global_rank
        }

        serializer = RatingTopSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def detail(self, request):
        user = request.user
        return Response({
            'volume_points': user.volume_points,
            'deals_points': user.deals_points,
            'share_points': user.share_points,
            'total_points': user.total_points,
            'volume_calculation': 'Баллы за объём: 10 баллов за каждый млн руб.',
            'deals_calculation': 'Баллы за сделки: 6 баллов за каждую сделку',
            'share_calculation': 'Баллы за долю банка: 5 баллов за каждые 5% доли'
        })


class CalculatorViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def simulate(self, request):
        serializer = CalculatorRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        data = serializer.validated_data

        new_deals_points = user.deals_points + (data['additional_deals'] * 6)
        new_volume_points = user.volume_points + (data['additional_volume'] / 1000000 * 10)
        new_share_points = user.share_points + (data['additional_share'] * 5)

        new_total_points = new_deals_points + new_volume_points + new_share_points

        new_level = Level.objects.filter(min_points__lte=new_total_points).last()

        financial_effect = new_level.financial_effect if new_level else 0

        response_data = {
            'new_total_points': new_total_points,
            'new_level': new_level,
            'financial_effect': financial_effect,
            'additional_deals': data['additional_deals'],
            'additional_volume': data['additional_volume'],
            'additional_share': data['additional_share'],
            'additional_products': data['additional_products']
        }

        response_serializer = CalculatorResponseSerializer(response_data)
        return Response(response_serializer.data)


class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Deal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DailyResultViewSet(viewsets.ModelViewSet):
    serializer_class = DailyResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyResult.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        today = timezone.now().date()
        daily_result, created = DailyResult.objects.get_or_create(
            user=self.request.user,
            date=today,
            defaults=serializer.validated_data
        )
        if not created:
            for key, value in serializer.validated_data.items():
                setattr(daily_result, key, value)
            daily_result.save()

        user = self.request.user
        user.total_deals += daily_result.deals_count
        user.total_volume += daily_result.volume
        user.save()

        for _ in range(daily_result.deals_count):
            Deal.objects.create(
                user=user,
                amount=daily_result.volume / daily_result.deals_count if daily_result.deals_count > 0 else 0,
                additional_products=daily_result.additional_products
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TaskViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Task.objects.filter(is_active=True)
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        user_tasks = UserTask.objects.filter(user=request.user)
        serializer = UserTaskSerializer(user_tasks, many=True)
        return Response(serializer.data)


class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = News.objects.filter(is_published=True)
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]


class TrainingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TrainingModule.objects.all()
    serializer_class = TrainingModuleSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['get'])
    def test(self, request, pk=None):
        module = self.get_object()
        tests = TrainingTest.objects.filter(module=module)
        serializer = TrainingTestSerializer(tests, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        module = self.get_object()
        answers = request.data.get('answers', {})

        user_training, created = UserTraining.objects.get_or_create(
            user=request.user,
            module=module,
            defaults={'is_completed': False}
        )

        if user_training.is_completed:
            return Response({'message': 'Модуль уже пройден'}, status=status.HTTP_400_BAD_REQUEST)

        tests = TrainingTest.objects.filter(module=module)

        correct_count = 0
        for test in tests:
            user_answer = answers.get(str(test.id))
            if user_answer and user_answer.lower().strip() == test.correct_answer.lower().strip():
                correct_count += 1

        score = int((correct_count / tests.count()) * 100) if tests.count() > 0 else 100

        user_training.test_score = score
        user_training.earned_points = module.reward_points if score >= 70 else 0

        if score >= 70:
            user_training.is_completed = True
            user_training.completed_at = timezone.now()
            request.user.deals_points += module.reward_points
            request.user.save()

        user_training.save()

        return Response({
            'is_completed': user_training.is_completed,
            'score': score,
            'earned_points': user_training.earned_points,
            'required_score': 70
        })


class SupportViewSet(viewsets.ModelViewSet):
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SupportTicket.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        ticket = self.get_object()

        if request.method == 'GET':
            messages = ticket.messages.all()
            serializer = SupportMessageSerializer(messages, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            serializer = SupportMessageSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(
                    ticket=ticket,
                    author=request.user,
                    is_from_support=False
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BonusViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BonusSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bonus.objects.filter(user=self.request.user)