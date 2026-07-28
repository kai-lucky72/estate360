from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from properties.models import Property
from properties.serializers import PropertySerializer

User = get_user_model()


class PropertyAPITest(APITestCase):
    def setUp(self):
        self.agent = User.objects.create_user(username="agent1", password="pass123", email="agent@example.com")
        self.owner = User.objects.create_user(username="owner1", password="pass123", email="owner@example.com")
        self.admin = User.objects.create_superuser(username="admin1", email="admin@example.com", password="adminpass")
        self.client = APIClient()
        self.url = reverse("property-list")

    def test_create_property_authenticated(self):
        self.client.force_authenticate(user=self.agent)
        payload = {
            "title": "Modern Apartment",
            "description": "Fully furnished apartment in Kigali.",
            "price": "200000.00",
            "location": "Kigali City Center",
            "category": "apartment",
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Property.objects.count(), 1)

    def test_create_property_unauthenticated(self):
        payload = {
            "title": "Modern Apartment",
            "description": "Fully furnished apartment.",
            "price": "200000.00",
            "location": "Kigali",
            "category": "apartment",
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_properties_anyone(self):
        Property.objects.create(
            title="Villa", description="Nice villa", price="300000",
            location="Kacyiru", owner=self.owner, category="villa"
        )
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_property_owner_only(self):
        prop = Property.objects.create(
            title="Villa", description="Nice villa", price="300000",
            location="Kacyiru", owner=self.owner, category="villa"
        )
        detail_url = reverse("property-detail", args=[prop.id])

        self.client.force_authenticate(user=self.agent)
        response = self.client.patch(detail_url, {"title": "Updated Villa"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.owner)
        response = self.client.patch(detail_url, {"title": "Updated Villa"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        prop.refresh_from_db()
        self.assertEqual(prop.title, "Updated Villa")

    def test_delete_property_owner_or_admin(self):
        prop = Property.objects.create(
            title="Villa", description="Nice villa", price="300000",
            location="Kacyiru", owner=self.owner, category="villa"
        )
        detail_url = reverse("property-detail", args=[prop.id])

        self.client.force_authenticate(user=self.agent)
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Property.objects.count(), 0)

    def test_filter_by_category(self):
        Property.objects.create(
            title="Apartment", description="Nice apt", price="100000",
            location="Kigali", owner=self.owner, category="apartment"
        )
        Property.objects.create(
            title="Villa", description="Nice villa", price="300000",
            location="Kacyiru", owner=self.owner, category="villa"
        )
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data if isinstance(response.data, list) else response.data.get("results", [])
        categories = [item["category"] for item in results]
        self.assertIn("apartment", categories)
        self.assertIn("villa", categories)