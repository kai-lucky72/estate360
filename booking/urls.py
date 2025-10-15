from rest_framework.routers import DefaultRouter
from properties.views import PropertyViewSet
from booking.views import BookingViewSet

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = router.urls
