from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from properties.models import Property
from chat.models import ChatRoom, Message

User = get_user_model()

class ChatAppTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="alice", password="pass1234", email="alice@example.com")
        self.user2 = User.objects.create_user(username="bob", password="pass1234", email="bob@example.com")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

        self.owner = User.objects.create(username='property_owner', email='owner@example.com')
        self.property = Property.objects.create(
            title="Modern House",
            description="A beautiful house",
            price=500000,
            location="Kigali",
            category="house",
            owner=self.owner,
        )

        self.room = ChatRoom.objects.create(name="Room 1", property=self.property)
        self.room.participants.set([self.user1, self.user2])

        self.message = Message.objects.create(
            room=self.room,
            sender=self.user1,
            content="Welcome to the room!"
        )

    def test_chatroom_creation(self):
        """Test creating a new chatroom."""
        url = reverse("chatroom-list")
        response = self.client.post(url, {"name": "Test Room"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(ChatRoom.objects.filter(name="Test Room").exists())

    def test_message_creation(self):
        """Test sending a message."""
        url = reverse("message-list")
        response = self.client.post(url, {"room": self.room.id, "content": "Hello Bob"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Message.objects.filter(content="Hello Bob").exists())

    def test_list_messages(self):
        """Ensure messages are retrievable."""
        url = reverse("message-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any("Welcome" in msg["content"] for msg in response.data))

    def test_chatroom_participants(self):
        """Ensure participants are linked correctly."""
        url = reverse("chatroom-detail", args=[self.room.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["participants"]), 2)
