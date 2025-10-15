from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    recipient_name = serializers.CharField(source='recipient.username', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type',
            'sender', 'sender_name', 'recipient', 'recipient_name',
            'is_read', 'timestamp', 'related_object_id', 'related_app'
        ]
