from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from properties.models import Property

User = get_user_model()


class PropertyAPITest(APITestCase):
    def setUp(self):
        self.agent = User.objects.create_user(username="agent1", password="pass123")
        self.client.force_authenticate(user=self.agent)
        self.url = reverse("property-list")

    def test_create_property(self):
        payload = {
            "title": "Modern Apartment",
            "description": "Fully furnished apartment in Kigali.",
            "price": "200000.00",
            "location": "Kigali City Center",
            "agent": self.agent.id,
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Property.objects.count(), 1)
