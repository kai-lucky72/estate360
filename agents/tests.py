from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from properties.models import Property
from agents.models import Agent, AgentPropertyAssignment, Commission

User = get_user_model()

class AgentAPITests(APITestCase):
    def setUp(self):
        # Create users
        self.user = User.objects.create_user(
            username="agentuser",
            email="agent@example.com",
            password="strongpassword123",
            first_name="John",
            last_name="Doe",
        )

        self.client = APIClient()
        self.client.login(username="agentuser", password="strongpassword123")

        # Create agent profile
        self.agent = Agent.objects.create(
            user=self.user,
            bio="Top real estate agent in Kigali.",
            license_number="RWA-2025-001",
            phone="+250788888888",
            verified=True,
            rating=4.8,
        )

        # Create property
        self.property = Property.objects.create(
            title="Luxury Apartment",
            description="Modern apartment with city view",
            price=300000,
            location="Kigali City Center",
            property_type="apartment",
            bedrooms=3,
            bathrooms=2,
        )

        # Create assignment
        self.assignment = AgentPropertyAssignment.objects.create(
            agent=self.agent,
            property=self.property,
            active=True
        )

        # Create commission
        self.commission = Commission.objects.create(
            agent=self.agent,
            property=self.property,
            amount=25000.00,
            paid=False,
        )

    def test_agent_profile_created(self):
        """Ensure the agent profile is created successfully."""
        self.assertEqual(Agent.objects.count(), 1)
        self.assertTrue(self.agent.verified)
        self.assertEqual(self.agent.user.username, "agentuser")

    def test_property_assignment_relationship(self):
        """Ensure property assignments link correctly between agent and property."""
        self.assertEqual(self.assignment.agent, self.agent)
        self.assertEqual(self.assignment.property, self.property)

    def test_commission_creation(self):
        """Ensure commissions are properly recorded for agents."""
        self.assertEqual(self.commission.amount, 25000.00)
        self.assertFalse(self.commission.paid)

    def test_agent_list_api(self):
        """Ensure authenticated user can view agent list."""
        url = reverse("agent-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("RWA-2025-001", str(response.data))

    def test_agent_detail_api(self):
        """Ensure an agent’s details are accessible."""
        url = reverse("agent-detail", args=[self.agent.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["license_number"], "RWA-2025-001")

    def test_create_agent_api_forbidden_for_unauthenticated(self):
        """Ensure unauthenticated users cannot create an agent."""
        self.client.logout()
        url = reverse("agent-list")
        response = self.client.post(url, {
            "license_number": "RWA-2025-999",
            "bio": "Unauthorized",
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_assignment_list_api(self):
        """Ensure assignments can be listed through API."""
        url = reverse("agentpropertyassignment-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_commission_list_api(self):
        """Ensure commissions can be retrieved via API."""
        url = reverse("commission-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(c["amount"] == "25000.00" for c in response.data))

    def test_mark_commission_paid(self):
        """Simulate marking a commission as paid."""
        self.commission.paid = True
        self.commission.save()
        self.assertTrue(self.commission.paid)
