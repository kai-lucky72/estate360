from django.urls import path, include

urlpatterns = [
    path('v1/accounts/', include('accounts.urls')),
    path('v1/properties/', include('properties.urls')),
    path('v1/bookings/', include('booking.urls')),
    path('v1/payments/', include('payments.urls')),
    path('v1/contracts/', include('contracts.urls')),
    path('v1/tenancy/', include('tenancy.urls')),
    path('v1/agents/', include('agents.urls')),
    path('v1/investments/', include('investments.urls')),
    path('v1/maintenance/', include('maintenance.urls')),
    path('v1/chat/', include('chat.urls')),
    path('v1/analytics/', include('analytics.urls')),
    path('v1/notifications/', include('notifications.urls')),
    path('v1/reviews/', include('reviews.urls')),
    path('v1/admin_dashboard/', include('admin_dashboard.urls')),
]
