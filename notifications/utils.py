import logging
from .models import Notification

logger = logging.getLogger(__name__)


def send_notification(recipient, title, message, notification_type='system', sender=None, related_object_id=None, related_app=None):
    notification = Notification.objects.create(
        recipient=recipient,
        sender=sender,
        title=title,
        message=message,
        notification_type=notification_type,
        related_object_id=related_object_id,
        related_app=related_app
    )
    logger.info(f"Notification sent to {recipient}: {title} [{notification_type}]")
    return notification


def send_bulk_notification(recipients, title, message, notification_type='system', sender=None, related_object_id=None, related_app=None):
    notifications = []
    for recipient in recipients:
        notification = Notification.objects.create(
            recipient=recipient,
            sender=sender,
            title=title,
            message=message,
            notification_type=notification_type,
            related_object_id=related_object_id,
            related_app=related_app
        )
        notifications.append(notification)
    logger.info(f"Bulk notification sent to {len(recipients)} recipients: {title}")
    return notifications