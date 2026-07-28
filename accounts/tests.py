from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse

User = get_user_model()


class UserModelTests(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(username="testuser", email="user@example.com", password="pass123")
        self.assertEqual(user.email, "user@example.com")
        self.assertTrue(user.check_password("pass123"))

    def test_create_superuser(self):
        admin = User.objects.create_superuser(username="admin", email="admin@example.com", password="adminpass")
        self.assertTrue(admin.is_superuser)
        self.assertEqual(admin.role, "admin")

    def test_user_str(self):
        user = User.objects.create_user(username="testuser", email="user@example.com", password="pass123")
        self.assertIn("testuser", str(user))


class UserAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse("user-register")
        self.token_url = reverse("token_obtain_pair")
        self.refresh_url = reverse("token_refresh")

    def test_user_registration(self):
        payload = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "strongpass123",
            "role": "tenant",
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

    def test_user_registration_missing_fields(self):
        payload = {
            "username": "newuser",
            "email": "newuser@example.com",
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_jwt_token_obtain(self):
        User.objects.create_user(username="testuser", email="user@example.com", password="pass123")
        response = self.client.post(self.token_url, {
            "email": "user@example.com",
            "password": "pass123",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_jwt_token_obtain_invalid_credentials(self):
        response = self.client.post(self.token_url, {
            "email": "nonexistent@example.com",
            "password": "wrongpass",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        User.objects.create_user(username="testuser", email="user@example.com", password="pass123")
        token_resp = self.client.post(self.token_url, {
            "email": "user@example.com",
            "password": "pass123",
        }, format="json")
        refresh_token = token_resp.data["refresh"]
        response = self.client.post(self.refresh_url, {
            "refresh": refresh_token,
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_change_password(self):
        user = User.objects.create_user(username="testuser", email="user@example.com", password="oldpass123")
        self.client.force_authenticate(user=user)
        url = reverse("user-change-password")
        response = self.client.post(url, {
            "old_password": "oldpass123",
            "new_password": "newpass456",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.check_password("newpass456"))

    def test_change_password_wrong_old(self):
        user = User.objects.create_user(username="testuser", email="user@example.com", password="oldpass123")
        self.client.force_authenticate(user=user)
        url = reverse("user-change-password")
        response = self.client.post(url, {
            "old_password": "wrongpass",
            "new_password": "newpass456",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthenticated_cannot_access_users(self):
        url = reverse("user-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)