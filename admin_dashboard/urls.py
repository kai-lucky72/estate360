from django.urls import path
from .views import DashboardSummaryView, DashboardStatListView, SystemLogListView

urlpatterns = [
    path('summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('stats/', DashboardStatListView.as_view(), name='dashboard-stats'),
    path('logs/', SystemLogListView.as_view(), name='system-logs'),
]
