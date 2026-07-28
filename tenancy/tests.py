from django.test import TestCase
from django.contrib.auth import get_user_model
from properties.models import Property
from contracts.models import Contract
from .models import Tenant, Lease, RentPayment

User = get_user_model()


class TenancyTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='tenant_user', email='tenant@example.com')
        self.tenant = Tenant.objects.create(user=self.user, phone_number='0788888888', id_number='ID123')
        self.owner = User.objects.create(username='property_owner', email='owner@example.com')
        self.property = Property.objects.create(title='Green Villa', price=2000, owner=self.owner, category='villa')
        
        # Need to create Booking and Contract properly
        from booking.models import Booking
        self.booking = Booking.objects.create(property=self.property, client=self.user, scheduled_date="2025-01-01")
        self.contract = Contract.objects.create(
            booking=self.booking, property=self.property, client=self.user, agent=self.owner,
            start_date="2025-01-01", end_date="2026-01-01", rent_amount=2000, terms="Terms"
        )

    def test_create_lease(self):
        lease = Lease.objects.create(
            property=self.property,
            tenant=self.tenant,
            contract=self.contract,
            start_date='2025-01-01',
            end_date='2026-01-01',
            rent_amount=2000
        )
        self.assertEqual(str(lease), 'Green Villa - tenant_user')

    def test_rent_payment(self):
        lease = Lease.objects.create(
            property=self.property,
            tenant=self.tenant,
            start_date='2025-01-01',
            end_date='2026-01-01',
            rent_amount=2000
        )
        payment = RentPayment.objects.create(
            lease=lease,
            amount_paid=2000,
            receipt_number='R001',
            payment_method='cash'
        )
        self.assertTrue(payment.receipt_number.startswith('R'))
