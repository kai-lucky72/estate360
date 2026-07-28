from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from properties.models import Property
from agents.models import Agent
from investments.models import Investment
from analytics.models import PropertyAnalytics, AgentPerformance, InvestmentTrend

User = get_user_model()

class AnalyticsTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="password123", email="test@test.com")
        self.client.force_authenticate(user=self.user)

        self.owner = User.objects.create(username='property_owner', email='owner@example.com')
        self.property = Property.objects.create(
            title="Kigali Villa",
            description="Luxury villa in Kigali",
            price=800000,
            location="Kacyiru",
            category="villa",
            owner=self.owner,
        )

        self.agent = Agent.objects.create(
            user=self.user,
            bio="Top agent in Kigali",
            license_number="RWA-999",
            verified=True,
        )

        self.investment = Investment.objects.create(
            investor=self.user,
            property=self.property,
            amount_invested=250000.00,
            share_percentage=25.0,
            roi_estimate=10.0,
        )

        self.analytics = PropertyAnalytics.objects.create(property=self.property, views=100)
        self.performance = AgentPerformance.objects.create(agent=self.agent, total_sales=500000)
        self.trend = InvestmentTrend.objects.create(investment=self.investment, investor=self.user, roi_percentage=5.2)

    def test_property_analytics_retrieval(self):
        url = reverse("property-analytics-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any("Kigali Villa" in str(a) for a in response.data))

    def test_agent_performance_retrieval(self):
        url = reverse("agent-performance-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any("Top agent" in str(a) for a in response.data))

    def test_investment_trend_creation(self):
        url = reverse("investment-trends-list")
        response = self.client.post(url, {
            "investment": self.investment.id,
            "investor": self.user.id,
            "roi_percentage": 10.0,
            "trend_type": "growth"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
