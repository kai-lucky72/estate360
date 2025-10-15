from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class UserTests(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(username="testuser", email="user@example.com", password="pass123")
        self.assertEqual(user.email, "user@example.com")
        self.assertTrue(user.check_password("pass123"))

    def test_create_superuser(self):
        admin = User.objects.create_superuser(username="admin", email="admin@example.com", password="adminpass")
        self.assertTrue(admin.is_superuser)
        self.assertEqual(admin.role, "admin")
