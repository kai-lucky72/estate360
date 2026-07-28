def log_system_action(actor, action, details=""):
    from .models import SystemLog
    SystemLog.objects.create(
        actor=actor,
        action=action,
        details=details
    )