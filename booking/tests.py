from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from properties.models import Property
from booking.models import Booking

User = get_user_model()


class BookingAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.client_user = User.objects.create_user(username="client1", password="pass123", email="client1@example.com")
        self.agent = User.objects.create_user(username="agent1", password="pass123", email="agent1@example.com")
        self.owner = User.objects.create_user(username="owner1", password="pass123", email="owner1@example.com")
        self.property = Property.objects.create(
            title="Luxury Villa",
            description="Beautiful view over Kigali",
            price="450000.00",
            location="Kacyiru",
            owner=self.owner,
            category="villa",
        )
        self.url = reverse("booking-list")

    def test_create_booking_authenticated(self):
        self.client.force_authenticate(user=self.client_user)
        payload = {
            "property": self.property.id,
            "scheduled_date": "2025-10-20",
            "scheduled_time": "14:30:00",
            "notes": "Please confirm via email.",
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)
        self.assertEqual(Booking.objects.first().client, self.client_user)

    def test_cannot_create_booking_unauthenticated(self):
        payload = {
            "property": self.property.id,
            "scheduled_date": "2025-10-20",
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_own_bookings(self):
        self.client.force_authenticate(user=self.client_user)
        Booking.objects.create(
            property=self.property, client=self.client_user, agent=self.agent,
            scheduled_date="2025-10-20", scheduled_time="14:30"
        )
        other_user = User.objects.create_user(username="other", password="pass123", email="other@example.com")
        Booking.objects.create(
            property=self.property, client=other_user, agent=self.agent,
            scheduled_date="2025-10-21", scheduled_time="15:00"
        )
        response = self.client.get(self.url)
        self.assertEqual(len(response.data), 2)

    def test_cancel_booking(self):
        self.client.force_authenticate(user=self.client_user)
        booking = Booking.objects.create(
            property=self.property, client=self.client_user, agent=self.agent,
            scheduled_date="2025-10-20", scheduled_time="14:30"
        )
        cancel_url = reverse("booking-cancel", args=[booking.id])
        response = self.client.post(cancel_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.status, "cancelled")