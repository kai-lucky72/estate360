from rest_framework import generics, views, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Sum, Q
from django.utils import timezone
from django.shortcuts import get_object_or_404

from core.permissions import IsAdminOnly

from .models import DashboardStat, SystemLog
from .serializers import (
    AdminUserSerializer, AdminPropertySerializer, AdminBookingSerializer,
    AdminPaymentSerializer, AdminContractSerializer, AdminAgentSerializer,
    SystemLogSerializer, DashboardStatSerializer,
)
from accounts.models import User
from properties.models import Property
from booking.models import Booking
from payments.models import Payment
from contracts.models import Contract
from agents.models import Agent, AgentPropertyAssignment, Commission


class DashboardSummaryView(views.APIView):
    permission_classes = [IsAdminOnly]

    def get(self, request):
        total_users = User.objects.count()
        total_properties = Property.objects.count()
        total_contracts = Contract.objects.count()
        total_payments = Payment.objects.aggregate(total=Sum('amount'))['total'] or 0
        total_bookings = Booking.objects.count()
        total_revenue = total_payments

        data = {
            "total_users": total_users,
            "total_properties": total_properties,
            "total_contracts": total_contracts,
            "total_payments": total_payments,
            "total_bookings": total_bookings,
            "total_revenue": total_revenue,
        }
        return Response(data)


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        role = self.request.query_params.get('role')
        if search:
            qs = qs.filter(Q(email__icontains=search) | Q(username__icontains=search))
        if role:
            qs = qs.filter(role=role)
        return qs

    @action(detail=True, methods=['post'])
    def toggle_user_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        SystemLog.objects.create(
            actor=request.user,
            action=f"{'Activated' if user.is_active else 'Deactivated'} user {user.email}",
        )
        return Response({'is_active': user.is_active})


class AdminPropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-date_added')
    serializer_class = AdminPropertySerializer
    permission_classes = [IsAdminOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        status = self.request.query_params.get('status')
        category = self.request.query_params.get('category')
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(location__icontains=search))
        if status:
            qs = qs.filter(status=status)
        if category:
            qs = qs.filter(category=category)
        return qs

    def perform_destroy(self, instance):
        SystemLog.objects.create(
            actor=self.request.user,
            action=f"Deleted property #{instance.id} - {instance.title}",
        )
        instance.delete()


class AdminBookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = AdminBookingSerializer
    permission_classes = [IsAdminOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs

    @action(detail=True, methods=['post'])
    def approve_booking(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'approved'
        booking.save()
        SystemLog.objects.create(
            actor=request.user,
            action=f"Approved booking #{booking.id} for {booking.property.title}",
        )
        return Response({'status': 'approved'})


class AdminPaymentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Payment.objects.all().order_by('-date')
    serializer_class = AdminPaymentSerializer
    permission_classes = [IsAdminOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        method = self.request.query_params.get('method')
        ptype = self.request.query_params.get('type')
        if method:
            qs = qs.filter(payment_method=method)
        if ptype:
            qs = qs.filter(payment_type=ptype)
        return qs


class AdminContractViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Contract.objects.all().order_by('-created_at')
    serializer_class = AdminContractSerializer
    permission_classes = [IsAdminOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs


class AdminAgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AdminAgentSerializer
    permission_classes = [IsAdminOnly]

    @action(detail=True, methods=['post'])
    def verify_agent(self, request, pk=None):
        agent = self.get_object()
        agent.verified = True
        agent.save()
        SystemLog.objects.create(
            actor=request.user,
            action=f"Verified agent {agent.user.email}",
        )
        return Response({'verified': True})


class SystemLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SystemLog.objects.all().order_by('-timestamp')
    serializer_class = SystemLogSerializer
    permission_classes = [IsAdminOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        action_type = self.request.query_params.get('action')
        search = self.request.query_params.get('search')
        if action_type:
            qs = qs.filter(action__icontains=action_type)
        if search:
            qs = qs.filter(details__icontains=search)
        return qs


class DashboardStatViewSet(viewsets.ModelViewSet):
    queryset = DashboardStat.objects.all().order_by('-date')
    serializer_class = DashboardStatSerializer
    permission_classes = [IsAdminOnly]
