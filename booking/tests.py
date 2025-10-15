from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from properties.models import Property
from booking.models import Booking

User = get_user_model()


class BookingAPITest(APITestCase):
    def setUp(self):
        self.agent = User.objects.create_user(username="agent1", password="pass123")
        self.client_user = User.objects.create_user(username="client1", password="pass123")
        self.client.force_authenticate(user=self.client_user)

        self.property = Property.objects.create(
            title="Luxury Villa",
            description="Beautiful view over Kigali",
            price="450000.00",
            location="Kacyiru",
            agent=self.agent,
        )
        self.url = reverse("booking-list")

    def test_create_booking(self):
        payload = {
            "property": self.property.id,
            "scheduled_date": "2025-10-20",
            "scheduled_time": "14:30:00",
            "notes": "Please confirm via email.",
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)
        self.assertEqual(Booking.objects.first().agent, self.agent)
