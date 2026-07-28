from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from booking.models import Booking
from properties.models import Property
from contracts.models import Contract
from contracts.serializers import ContractSerializer
import datetime

User = get_user_model()


class ContractAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.agent = User.objects.create_user(username="agent1", password="pass123", email="agent1@example.com")
        self.client_user = User.objects.create_user(username="client1", password="pass123", email="client1@example.com")
        self.owner = User.objects.create_user(username="owner1", password="pass123", email="owner1@example.com")
        self.property = Property.objects.create(
            title="House", description="Nice one", price="120000",
            location="Kigali", owner=self.owner, category="house"
        )
        self.booking = Booking.objects.create(
            property=self.property, client=self.client_user, agent=self.agent,
            scheduled_date="2025-10-15", scheduled_time="12:00", status="approved"
        )
        self.client.force_authenticate(user=self.client_user)

    def test_create_contract_from_approved_booking(self):
        payload = {
            "booking": self.booking.id,
            "property": self.property.id,
            "client": self.client_user.id,
            "agent": self.agent.id,
            "start_date": str(datetime.date.today()),
            "end_date": str(datetime.date.today() + datetime.timedelta(days=365)),
            "rent_amount": "120000.00",
            "terms": "Client must not sublet the property.",
        }
        response = self.client.post(reverse("contract-list"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contract.objects.count(), 1)

    def test_cannot_create_contract_without_booking(self):
        payload = {
            "property": self.property.id,
            "client": self.client_user.id,
            "start_date": str(datetime.date.today()),
            "end_date": str(datetime.date.today() + datetime.timedelta(days=365)),
            "rent_amount": "120000.00",
            "terms": "Test terms.",
        }
        response = self.client.post(reverse("contract-list"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_create_contract_from_non_approved_booking(self):
        pending_booking = Booking.objects.create(
            property=self.property, client=self.client_user, agent=self.agent,
            scheduled_date="2025-10-15", scheduled_time="12:00", status="pending"
        )
        payload = {
            "booking": pending_booking.id,
            "property": self.property.id,
            "client": self.client_user.id,
            "agent": self.agent.id,
            "start_date": str(datetime.date.today()),
            "end_date": str(datetime.date.today() + datetime.timedelta(days=365)),
            "rent_amount": "120000.00",
            "terms": "Test terms.",
        }
        response = self.client.post(reverse("contract-list"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_sign_contract(self):
        contract = Contract.objects.create(
            booking=self.booking, property=self.property,
            client=self.client_user, agent=self.agent,
            start_date=datetime.date.today(),
            end_date=datetime.date.today() + datetime.timedelta(days=365),
            rent_amount=120000, terms="Standard terms"
        )
        sign_url = reverse("contract-sign", args=[contract.id])
        response = self.client.post(sign_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        contract.refresh_from_db()
        self.assertEqual(contract.status, "draft")