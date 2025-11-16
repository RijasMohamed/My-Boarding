from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        # Import signals to connect model event handlers (real-time notifications)
        try:
            from . import signals  # noqa: F401
        except Exception:
            # Fail silently during static analysis or if dependencies aren't installed
            pass
