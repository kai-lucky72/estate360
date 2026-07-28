from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .models import Payment

User = get_user_model()


class PaymentModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='payer', email='payer@example.com', password='pass123')

    def test_create_payment(self):
        payment = Payment.objects.create(
            payer=self.user,
            payment_type='rent',
            amount=500,
            payment_method='mobile',
            reference='TXN001'
        )
        self.assertEqual(payment.reference, 'TXN001')
        self.assertFalse(payment.verified)

    def test_payment_str(self):
        payment = Payment.objects.create(
            payer=self.user, payment_type='rent', amount=500,
            payment_method='mobile', reference='TXN002'
        )
        self.assertIn("rent", str(payment))
        self.assertIn("TXN002", str(payment))


class PaymentAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='payer1', email='payer1@example.com', password='pass123')
        self.other_user = User.objects.create_user(username='other', email='other@example.com', password='pass123')
        self.url = reverse("payment-list")

    def test_create_payment_authenticated(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            "payment_type": "rent",
            "amount": "500.00",
            "payment_method": "mobile",
            "reference": "TXN100",
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Payment.objects.count(), 1)

    def test_create_payment_unauthenticated(self):
        payload = {
            "payment_type": "rent",
            "amount": "500.00",
            "payment_method": "mobile",
            "reference": "TXN101",
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_own_payments(self):
        Payment.objects.create(
            payer=self.user, payment_type='rent', amount=500,
            payment_method='mobile', reference='TXN200'
        )
        Payment.objects.create(
            payer=self.other_user, payment_type='rent', amount=300,
            payment_method='cash', reference='TXN201'
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        for p in response.data:
            self.assertEqual(p["payer"], str(self.user))