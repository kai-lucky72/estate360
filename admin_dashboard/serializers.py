from rest_framework import serializers
from .models import DashboardStat, SystemLog

class DashboardStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardStat
        fields = '__all__'


class SystemLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source='actor.username', read_only=True)

    class Meta:
        model = SystemLog
        fields = ['id', 'actor_name', 'action', 'timestamp', 'details']
