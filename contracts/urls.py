from rest_framework.routers import DefaultRouter
from booking.views import BookingViewSet
from contracts.views import ContractViewSet
from properties.views import PropertyViewSet

router = DefaultRouter()
router.register(r'properties', PropertyViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'contracts', ContractViewSet)

urlpatterns = router.urls
