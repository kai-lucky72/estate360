from django.db import models
from django.conf import settings
from properties.models import Property

User = settings.AUTH_USER_MODEL

class ChatRoom(models.Model):
    """Represents a chat room for property discussions or private agent-client threads."""
    name = models.CharField(max_length=255, unique=True)
    participants = models.ManyToManyField(User, related_name="chatrooms")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="chat_rooms", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    """Message model storing text and metadata for each chat message."""
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages", null=True, blank=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} → {self.room.name}: {self.content[:20]}"
