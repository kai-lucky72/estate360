from rest_framework import serializers
from .models import Payment
from tenancy.serializers import LeaseSerializer
from investments.serializers import InvestmentSerializer
from contracts.serializers import ContractSerializer


class PaymentSerializer(serializers.ModelSerializer):
    lease = LeaseSerializer(read_only=True)
    investment = InvestmentSerializer(read_only=True)
    contract = ContractSerializer(read_only=True)
    payer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
