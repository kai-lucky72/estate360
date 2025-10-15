from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Payment

User = get_user_model()


class PaymentTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='payer')

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
