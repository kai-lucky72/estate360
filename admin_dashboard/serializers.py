from rest_framework import serializers
from .models import SystemReport, DashboardStat, SystemLog
from accounts.models import User
from properties.models import Property
from booking.models import Booking
from payments.models import Payment
from contracts.models import Contract
from agents.models import Agent, AgentPropertyAssignment, Commission

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'phone', 'is_verified', 'is_active', 'date_joined', 'last_login']

class AdminPropertySerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    class Meta:
        model = Property
        fields = '__all__'

class AdminBookingSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    class Meta:
        model = Booking
        fields = '__all__'

class AdminPaymentSerializer(serializers.ModelSerializer):
    payer_name = serializers.CharField(source='payer.username', read_only=True)
    class Meta:
        model = Payment
        fields = '__all__'

class AdminContractSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    class Meta:
        model = Contract
        fields = '__all__'

class AdminAgentSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = Agent
        fields = '__all__'

class SystemLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source='actor.username', read_only=True)
    class Meta:
        model = SystemLog
        fields = '__all__'

class DashboardStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardStat
        fields = '__all__'
