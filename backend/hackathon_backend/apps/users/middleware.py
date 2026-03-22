from __future__ import annotations

import logging

from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token

from .monthly import apply_monthly_status_credits

logger = logging.getLogger(__name__)


def _user_from_authorization_header(request):
    auth = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth.startswith('Token '):
        return None
    key = auth[6:].strip()
    if not key:
        return None
    try:
        return Token.objects.select_related('user').get(key=key).user
    except Token.DoesNotExist:
        return None


class MonthlyStatusCreditMiddleware:
    """После смены месяца — обновить статус по баллам и +1 к месяцам в статусе."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.path.startswith('/api/'):
            return self.get_response(request)

        user = getattr(request, 'user', None)
        if isinstance(user, AnonymousUser) or not user.is_authenticated:
            user = _user_from_authorization_header(request)

        if user is not None and user.is_authenticated:
            try:
                apply_monthly_status_credits(user.pk)
            except Exception:
                logger.exception('Monthly status credit failed for user_id=%s', user.pk)

        return self.get_response(request)
