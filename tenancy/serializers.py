from rest_framework import serializers
from .models import Tenant, Lease, RentPayment
from properties.serializers import PropertySerializer
from contracts.serializers import ContractSerializer


class TenantSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Tenant
        fields = '__all__'


class RentPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentPayment
        fields = '__all__'


class LeaseSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    tenant = TenantSerializer(read_only=True)
    payments = RentPaymentSerializer(many=True, read_only=True)
    contract = ContractSerializer(read_only=True)

    class Meta:
        model = Lease
        fields = '__all__'
