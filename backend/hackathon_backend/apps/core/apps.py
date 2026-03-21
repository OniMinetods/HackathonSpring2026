from django.apps import AppConfig


class CoreConfig(AppConfig):
    """Конфигурация приложения core.
    Указывает имя приложения в Django и человекочитаемое название."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core'
    verbose_name = 'Основное приложение'