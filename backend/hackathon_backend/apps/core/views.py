from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum, Count, F, Q
from django.utils import timezone
from django.contrib.auth import get_user_model
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

User = get_user_model()


# ============= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ПЕРЕИСПОЛЬЗОВАНИЯ =============

def get_level_by_score(score):
    """
    Определение уровня на основе балла результативности.

    Пороги уровней:
    - Silver: 0-70 баллов
    - Gold: 70-90 баллов
    - Black: 90+ баллов

    Args:
        score: числовое значение балла результативности

    Returns:
        dict: словарь с информацией об уровне
    """
    if score >= 90:
        return {'slug': 'black', 'name': 'Black', 'min_points': 90}
    elif score >= 70:
        return {'slug': 'gold', 'name': 'Gold', 'min_points': 70}
    else:
        return {'slug': 'silver', 'name': 'Silver', 'min_points': 0}


def get_next_level(score):
    """
    Определение следующего уровня для отображения прогресса.

    Args:
        score: текущий балл пользователя

    Returns:
        dict: информация о следующем уровне или None, если достигнут максимум
    """
    if score < 70:
        return {'slug': 'gold', 'name': 'Gold', 'min_points': 70}
    elif score < 90:
        return {'slug': 'black', 'name': 'Black', 'min_points': 90}
    return None


def calculate_progress_to_next(score, current_level, next_level):
    """
    Расчет процента прогресса до следующего уровня.

    Args:
        score: текущий балл пользователя
        current_level: текущий уровень
        next_level: следующий уровень

    Returns:
        float: процент прогресса (0-100)
    """
    if not next_level:
        return 100
    range_points = next_level['min_points'] - current_level['min_points']
    progress = (score - current_level['min_points']) / range_points * 100
    return min(100, max(0, progress))


def calculate_performance_score(user):
    """
    Расчет балла результативности по формуле:
    0,35 * индекс объема + 0,25 * индекс количества сделок +
    0,25 * индекс доли банка + 0,15 * конверсия

    Args:
        user: объект пользователя

    Returns:
        dict: словарь с total_score и breakdown
    """
    # 1. Индекс объема: (факт/план) * 100, ограничение макс = 120
    volume_plan = user.volume_of_transactions_plan if user.volume_of_transactions_plan > 0 else 1
    volume_index = min((user.volume_of_transactions / volume_plan) * 100, 120)

    # 2. Индекс количества сделок: (факт/план) * 100
    deals_plan = user.number_of_transactions_plan if user.number_of_transactions_plan > 0 else 1
    deals_index = (user.number_of_transactions / deals_plan) * 100

    # 3. Индекс доли банка: (фактическая доля / целевая доля) * 100
    share_plan = user.bank_share_plan if user.bank_share_plan > 0 else 1
    share_index = (user.bank_share / share_plan) * 100

    # 4. Конверсия: (одобрено заявок / подано заявок) * 100
    conversion_rate = user.conversion_rate

    # Применение весовых коэффициентов
    volume_score = 0.35 * volume_index
    deals_score = 0.25 * deals_index
    share_score = 0.25 * share_index
    conversion_score = 0.15 * conversion_rate

    total_score = volume_score + deals_score + share_score + conversion_score

    return {
        'total_score': total_score,
        'breakdown': {
            'volume_index': volume_index,
            'volume_score': volume_score,
            'deals_index': deals_index,
            'deals_score': deals_score,
            'share_index': share_index,
            'share_score': share_score,
            'conversion_rate': conversion_rate,
            'conversion_score': conversion_score,
            'weights': {
                'volume': 0.35,
                'deals': 0.25,
                'share': 0.25,
                'conversion': 0.15
            }
        }
    }


def calculate_performance_score_with_breakdown(user):
    """
    Расчет балла с детальной разбивкой по показателям.

    Returns:
        dict: подробная информация о расчете балла
    """
    volume_plan = user.volume_of_transactions_plan if user.volume_of_transactions_plan > 0 else 1
    volume_index = min((user.volume_of_transactions / volume_plan) * 100, 120)
    volume_score = 0.35 * volume_index

    deals_plan = user.number_of_transactions_plan if user.number_of_transactions_plan > 0 else 1
    deals_index = (user.number_of_transactions / deals_plan) * 100
    deals_score = 0.25 * deals_index

    share_plan = user.bank_share_plan if user.bank_share_plan > 0 else 1
    share_index = (user.bank_share / share_plan) * 100
    share_score = 0.25 * share_index

    conversion_rate = user.conversion_rate
    conversion_score = 0.15 * conversion_rate

    total_score = volume_score + deals_score + share_score + conversion_score

    return {
        'volume_index': volume_index,
        'volume_score': volume_score,
        'deals_index': deals_index,
        'deals_score': deals_score,
        'share_index': share_index,
        'share_score': share_score,
        'conversion_rate': conversion_rate,
        'conversion_score': conversion_score,
        'total_score': total_score
    }


# ============= VIEWSET =============

class LevelViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для просмотра уровней"""
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [AllowAny]


class PrivilegeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для просмотра привилегий"""
    serializer_class = PrivilegeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Фильтрация привилегий по уровню"""
        queryset = Privilege.objects.all()
        level = self.request.query_params.get('level')
        if level:
            queryset = queryset.filter(level__slug=level)
        return queryset


class DashboardViewSet(viewsets.ViewSet):
    """ViewSet для дашборда пользователя"""
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_status(self, request):
        """
        Получение текущего статуса пользователя:
        - текущий уровень
        - прогресс до следующего уровня
        - статистика за сегодня
        - разбор баллов по показателям
        """
        user = request.user

        # Расчет результативности по новой формуле
        performance_data = calculate_performance_score(user)

        # Определение уровня на основе общего балла
        total_score = performance_data['total_score']
        current_level = get_level_by_score(total_score)

        # Получение информации о следующем уровне
        next_level = get_next_level(total_score)
        points_to_next = next_level['min_points'] - total_score if next_level else 0
        progress_to_next = calculate_progress_to_next(total_score, current_level, next_level)

        # Статистика за сегодня
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

        data = {
            'user': user,
            'current_level': current_level,
            'next_level': next_level,
            'progress_to_next': progress_to_next,
            'points_to_next': points_to_next,
            'today_stats': today_stats,
            'total_points': total_score,
            'points_breakdown': performance_data['breakdown']
        }

        serializer = DashboardSerializer(data)
        return Response(serializer.data)


class FinancialEffectViewSet(viewsets.ViewSet):
    """ViewSet для расчета финансового эффекта пользователя"""
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_effect(self, request):
        """
        Расчет финансового эффекта:
        - накопленные бонусы
        - выгода от текущего уровня
        - экономия по ипотеке
        - кэшбэк
        - страховая выгода
        """
        user = request.user

        # Сумма всех начисленных бонусов
        total_bonuses = Bonus.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0

        # Расчет текущего балла для определения уровня
        score_data = calculate_performance_score(user)
        current_level_info = get_level_by_score(score_data['total_score'])

        # Выгоды от уровня (значения-примеры, в реальности берутся из модели Level)
        level_benefit = 0
        mortgage_savings = 0
        cashback = 0
        insurance_value = 0

        if current_level_info['slug'] == 'gold':
            level_benefit = 5000  # Пример: дополнительная выгода 5000 руб.
            cashback = 2  # Пример: 2% кэшбэк
        elif current_level_info['slug'] == 'black':
            level_benefit = 15000  # Пример: дополнительная выгода 15000 руб.
            cashback = 5  # Пример: 5% кэшбэк

        total_benefit = total_bonuses + level_benefit

        data = {
            'total_bonuses': total_bonuses,
            'level_benefit': level_benefit,
            'mortgage_savings': mortgage_savings,
            'cashback': cashback,
            'insurance_value': insurance_value,
            'total_benefit': total_benefit,
            'current_level': current_level_info
        }

        serializer = FinancialEffectSerializer(data)
        return Response(serializer.data)


class RatingViewSet(viewsets.ViewSet):
    """ViewSet для рейтингов пользователей"""
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_rating(self, request):
        """
        Получение рейтинга пользователя:
        - топ по дилерскому центру
        - топ по региону
        - глобальный топ
        - позиция пользователя в каждом рейтинге
        """
        user = request.user

        # Получение всех активных пользователей
        all_users = User.objects.filter(is_blocked=False)

        # Расчет балла для каждого пользователя
        # В реальном приложении рекомендуется кэшировать эти значения
        user_scores = []
        for u in all_users:
            score_data = calculate_performance_score(u)
            user_scores.append({
                'user': u,
                'score': score_data['total_score']
            })

        # Сортировка по убыванию балла
        user_scores.sort(key=lambda x: x['score'], reverse=True)

        # Рейтинг по дилерскому центру (пользователи с таким же dealer_code)
        dealer_users = [us for us in user_scores if us['user'].dealer_code == user.dealer_code]
        dealer_top = []
        dealer_rank = None
        for idx, us in enumerate(dealer_users[:10], 1):
            dealer_top.append({
                'id': us['user'].id,
                'full_name': us['user'].get_full_name(),
                'level': get_level_by_score(us['score'])['slug'],
                'total_points': us['score']
            })
            if us['user'].id == user.id:
                dealer_rank = idx

        # Глобальный рейтинг
        global_top = []
        global_rank = None
        for idx, us in enumerate(user_scores[:10], 1):
            global_top.append({
                'id': us['user'].id,
                'full_name': us['user'].get_full_name(),
                'level': get_level_by_score(us['score'])['slug'],
                'total_points': us['score']
            })
            if us['user'].id == user.id:
                global_rank = idx

        data = {
            'dealer_top': dealer_top,
            'dealer_rank': dealer_rank,
            'region_top': global_top,  # Топ-10 региона (для примера - глобальный)
            'region_rank': global_rank,
            'global_top': global_top,
            'global_rank': global_rank
        }

        serializer = RatingTopSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def detail(self, request):
        """
        Детальная информация о баллах пользователя:
        - баллы по каждому показателю
        - общая сумма баллов
        - описание расчета
        """
        user = request.user
        score_data = calculate_performance_score_with_breakdown(user)

        return Response({
            'volume_points': score_data['volume_score'],
            'deals_points': score_data['deals_score'],
            'share_points': score_data['share_score'],
            'conversion_points': score_data['conversion_score'],
            'total_points': score_data['total_score'],
            'volume_calculation': 'Объем: (факт/план) * 100, макс 120, вес 35%',
            'deals_calculation': 'Сделки: (факт/план) * 100, вес 25%',
            'share_calculation': 'Доля банка: (факт/цель) * 100, вес 25%',
            'conversion_calculation': 'Конверсия: (одобрено/подано) * 100, вес 15%'
        })


class CalculatorViewSet(viewsets.ViewSet):
    """ViewSet для калькулятора - симуляция достижений"""
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def simulate(self, request):
        """
        Симуляция изменения показателей:
        - дополнительные сделки
        - дополнительный объем
        - дополнительная доля банка
        - дополнительные продукты

        Возвращает новый уровень и финансовый эффект
        """
        serializer = CalculatorRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        data = serializer.validated_data

        # Текущий балл для сравнения
        current_score_data = calculate_performance_score(user)

        # Новые значения показателей
        new_volume = user.volume_of_transactions + data['additional_volume']
        new_deals = user.number_of_transactions + data['additional_deals']
        new_share = user.bank_share + data['additional_share']

        # Пересчет индексов с новыми значениями
        volume_plan = user.volume_of_transactions_plan if user.volume_of_transactions_plan > 0 else 1
        new_volume_index = min((new_volume / volume_plan) * 100, 120)
        new_volume_score = 0.35 * new_volume_index

        deals_plan = user.number_of_transactions_plan if user.number_of_transactions_plan > 0 else 1
        new_deals_index = (new_deals / deals_plan) * 100
        new_deals_score = 0.25 * new_deals_index

        share_plan = user.bank_share_plan if user.bank_share_plan > 0 else 1
        new_share_index = (new_share / share_plan) * 100
        new_share_score = 0.25 * new_share_index

        # Конверсия остается неизменной (можно добавить возможность изменения)
        conversion_rate = user.conversion_rate
        conversion_score = 0.15 * conversion_rate

        new_total_score = new_volume_score + new_deals_score + new_share_score + conversion_score

        # Определение нового уровня
        new_level = get_level_by_score(new_total_score)

        # Расчет финансового эффекта от нового уровня
        financial_effect = 0
        if new_level['slug'] == 'gold':
            financial_effect = 5000
        elif new_level['slug'] == 'black':
            financial_effect = 15000

        response_data = {
            'new_total_points': new_total_score,
            'new_level': new_level,
            'financial_effect': financial_effect,
            'additional_deals': data['additional_deals'],
            'additional_volume': data['additional_volume'],
            'additional_share': data['additional_share'],
            'additional_products': data['additional_products'],
            'current_total_points': current_score_data['total_score']
        }

        response_serializer = CalculatorResponseSerializer(response_data)
        return Response(response_serializer.data)


class DealViewSet(viewsets.ModelViewSet):
    """ViewSet для работы со сделками"""
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Возвращает только сделки текущего пользователя"""
        return Deal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """При создании сделки обновляем показатели пользователя"""
        deal = serializer.save(user=self.request.user)
        user = self.request.user
        user.volume_of_transactions += deal.amount
        user.number_of_transactions += 1
        user.save()


class DailyResultViewSet(viewsets.ModelViewSet):
    """ViewSet для ежедневных результатов"""
    serializer_class = DailyResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Возвращает только результаты текущего пользователя"""
        return DailyResult.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Создание или обновление ежедневного результата
        При сохранении обновляем общие показатели пользователя
        """
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

        # Обновление суммарных показателей пользователя
        user = self.request.user
        user.number_of_transactions += daily_result.deals_count
        user.volume_of_transactions += daily_result.volume
        user.save()

        # Создание записей о сделках
        for _ in range(daily_result.deals_count):
            Deal.objects.create(
                user=user,
                amount=daily_result.volume / daily_result.deals_count if daily_result.deals_count > 0 else 0,
                additional_products=daily_result.additional_products
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TaskViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для просмотра задач"""
    queryset = Task.objects.filter(is_active=True)
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        """Получение задач текущего пользователя"""
        user_tasks = UserTask.objects.filter(user=request.user)
        serializer = UserTaskSerializer(user_tasks, many=True)
        return Response(serializer.data)


class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для просмотра новостей"""
    queryset = News.objects.filter(is_published=True)
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]


class TrainingViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для обучения"""
    queryset = TrainingModule.objects.all()
    serializer_class = TrainingModuleSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        """Передача контекста запроса в сериализатор"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['get'])
    def test(self, request, pk=None):
        """Получение тестов для модуля обучения"""
        module = self.get_object()
        tests = TrainingTest.objects.filter(module=module)
        serializer = TrainingTestSerializer(tests, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Завершение модуля обучения:
        - проверка ответов на тесты
        - начисление баллов при успешной сдаче (>=70%)
        """
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

        # Подсчет правильных ответов
        correct_count = 0
        for test in tests:
            user_answer = answers.get(str(test.id))
            if user_answer and user_answer.lower().strip() == test.correct_answer.lower().strip():
                correct_count += 1

        # Расчет процента правильных ответов
        score = int((correct_count / tests.count()) * 100) if tests.count() > 0 else 100

        user_training.test_score = score
        user_training.earned_points = module.reward_points if score >= 70 else 0

        if score >= 70:
            user_training.is_completed = True
            user_training.completed_at = timezone.now()
            user_training.save()

        return Response({
            'is_completed': user_training.is_completed,
            'score': score,
            'earned_points': user_training.earned_points,
            'required_score': 70
        })


class SupportViewSet(viewsets.ModelViewSet):
    """ViewSet для обращений в поддержку"""
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Возвращает только обращения текущего пользователя"""
        return SupportTicket.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Создание обращения от текущего пользователя"""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        """
        Работа с сообщениями в обращении:
        - GET: получение всех сообщений
        - POST: отправка нового сообщения
        """
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
    """ViewSet для просмотра бонусов пользователя"""
    serializer_class = BonusSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Возвращает только бонусы текущего пользователя"""
        return Bonus.objects.filter(user=self.request.user)