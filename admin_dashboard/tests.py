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
        self.user = User.objects.create(username="admin", is_staff=True)
        self.client.force_authenticate(user=self.user)

        Property.objects.create(title="House 1", description="Nice house", price=100000)
        Contract.objects.create(property_id=1, tenant_name="John Doe", start_date="2024-01-01", end_date="2024-12-31")
        Payment.objects.create(amount=5000, method="cash", status="completed")

    def test_dashboard_summary(self):
        url = reverse('dashboard-summary')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("total_users", response.data)
        self.assertIn("total_properties", response.data)
        self.assertIn("total_contracts", response.data)
        self.assertIn("total_payments", response.data)
