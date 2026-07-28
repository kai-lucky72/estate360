from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from accounts.models import User
from properties.models import Property
from contracts.models import Contract
from payments.models import Payment


class AdminDashboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(username="admin", is_staff=True, email="admin@example.com")
        self.client.force_authenticate(user=self.user)

        owner = User.objects.create(username='property_owner', email='owner@example.com')
        self.property = Property.objects.create(title="House 1", description="Nice house", price=100000, owner=owner, category="house")
        from booking.models import Booking
        booking = Booking.objects.create(property=self.property, client=self.user, scheduled_date="2024-01-01")
        Contract.objects.create(booking=booking, property=self.property, client=self.user, agent=self.user, start_date="2024-01-01", end_date="2024-12-31", rent_amount=1000, terms="Terms")
        Payment.objects.create(payer=self.user, payment_type="rent", amount=5000, payment_method="cash", reference="REF123")

    def test_dashboard_summary(self):
        url = reverse('dashboard-summary')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("total_users", response.data)
        self.assertIn("total_properties", response.data)
        self.assertIn("total_contracts", response.data)
        self.assertIn("total_payments", response.data)
             