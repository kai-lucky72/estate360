from rest_framework import generics, views
from rest_framework.response import Response
from django.db.models import Count, Sum
from django.utils import timezone

from .models import DashboardStat, SystemLog
from properties.models import Property
from contracts.models import Contract
from payments.models import Payment
from accounts.models import User
from .serializers import DashboardStatSerializer, SystemLogSerializer


class DashboardSummaryView(views.APIView):
    """Return live dashboard summary"""
    def get(self, request):
        total_users = User.objects.count()
        total_properties = Property.objects.count()
        total_contracts = Contract.objects.count()
        total_payments = Payment.objects.aggregate(total=Sum('amount'))['total'] or 0

        data = {
            "total_users": total_users,
            "total_properties": total_properties,
            "total_contracts": total_contracts,
            "total_payments": total_payments
        }

        return Response(data)


class DashboardStatListView(generics.ListCreateAPIView):
    queryset = DashboardStat.objects.all().order_by('-date')
    serializer_class = DashboardStatSerializer


class SystemLogListView(generics.ListAPIView):
    queryset = SystemLog.objects.all().order_by('-timestamp')
    serializer_class = SystemLogSerializer
