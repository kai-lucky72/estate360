from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from booking.models import Booking
from properties.models import Property
from contracts.models import Contract
import datetime

User = get_user_model()


class ContractAPITest(APITestCase):
    def setUp(self):
        self.agent = User.objects.create_user(username="agent1", password="pass123")
        self.client_user = User.objects.create_user(username="client1", password="pass123")
        self.property = Property.objects.create(title="House", description="Nice one", price="120000", location="Kigali", agent=self.agent)
        self.booking = Booking.objects.create(property=self.property, client=self.client_user, agent=self.agent, scheduled_date="2025-10-15", scheduled_time="12:00", status="approved")
        self.client.force_authenticate(user=self.client_user)

    def test_create_contract(self):
        payload = {
            "booking": self.booking.id,
            "start_date": str(datetime.date.today()),
            "end_date": str(datetime.date.today() + datetime.timedelta(days=365)),
            "rent_amount": "120000.00",
            "terms": "Client must not sublet the property.",
        }
        response = self.client.post(reverse("contract-list"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contract.objects.count(), 1)
