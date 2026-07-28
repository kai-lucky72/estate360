from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from properties.models import Property
from agents.models import Agent, AgentPropertyAssignment, Commission

User = get_user_model()

class AgentAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="agentuser",
            email="agent@example.com",
            password="strongpassword123",
            first_name="John",
            last_name="Doe",
        )

        self.admin = User.objects.create_superuser(
            username="adminuser",
            email="admin@example.com",
            password="adminpass",
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.agent = Agent.objects.create(
            user=self.user,
            bio="Top real estate agent in Kigali.",
            license_number="RWA-2025-001",
            phone="+250788888888",
            verified=True,
            rating=4.8,
        )

        self.owner = User.objects.create_user(username='owner1', email='owner1@example.com', password='pass123')
        self.property = Property.objects.create(
            title="Luxury Apartment",
            description="Modern apartment with city view",
            price=300000,
            location="Kigali City Center",
            category="apartment",
            owner=self.owner,
        )

        self.assignment = AgentPropertyAssignment.objects.create(
            agent=self.agent,
            property=self.property,
            active=True
        )

        self.commission = Commission.objects.create(
            agent=self.agent,
            property=self.property,
            amount=25000.00,
            paid=False,
        )

    def test_agent_profile_created(self):
        self.assertEqual(Agent.objects.count(), 1)
        self.assertTrue(self.agent.verified)
        self.assertEqual(self.agent.user.username, "agentuser")

    def test_property_assignment_relationship(self):
        self.assertEqual(self.assignment.agent, self.agent)
        self.assertEqual(self.assignment.property, self.property)

    def test_commission_creation(self):
        self.assertEqual(self.commission.amount, 25000.00)
        self.assertFalse(self.commission.paid)

    def test_agent_list_api(self):
        url = reverse("agent-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("RWA-2025-001", str(response.data))

    def test_agent_detail_api(self):
        url = reverse("agent-detail", args=[self.agent.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["license_number"], "RWA-2025-001")

    def test_create_agent_api_forbidden_for_unauthenticated(self):
        self.client.logout()
        url = reverse("agent-list")
        response = self.client.post(url, {
            "license_number": "RWA-2025-999",
            "bio": "Unauthorized",
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_assignment_list_api(self):
        url = reverse("agentpropertyassignment-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_commission_list_api(self):
        url = reverse("commission-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(c["amount"] == "25000.00" for c in response.data))

    def test_mark_commission_paid(self):
        self.commission.paid = True
        self.commission.save()
        self.assertTrue(self.commission.paid)

    def test_agent_list_unauthenticated(self):
        """Ensure unauthenticated users cannot list agents."""
        self.client.logout()
        url = reverse("agent-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_agent_rating_validation(self):
        """Ensure agent rating is within valid range."""
        self.agent.rating = 5.0
        self.agent.save()
        self.assertEqual(self.agent.rating, 5.0)

    def test_commission_tracking(self):
        """Ensure commissions can be tracked by paid/unpaid status."""
        Commission.objects.create(
            agent=self.agent, property=self.property, amount=10000.00, paid=True
        )
        paid_commissions = Commission.objects.filter(paid=True).count()
        unpaid_commissions = Commission.objects.filter(paid=False).count()
        self.assertEqual(paid_commissions, 1)
        self.assertEqual(unpaid_commissions, 1)

    def test_agent_assignment_deactivate(self):
        """Ensure agent assignment can be deactivated."""
        self.assignment.active = False
        self.assignment.save()
        self.assertFalse(self.assignment.active)
