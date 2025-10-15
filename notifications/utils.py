from .models import Notification

def send_notification(recipient, title, message, notification_type='system', sender=None, related_object_id=None, related_app=None):
    Notification.objects.create(
        recipient=recipient,
        sender=sender,
        title=title,
        message=message,
        notification_type=notification_type,
        related_object_id=related_object_id,
        related_app=related_app
    )
