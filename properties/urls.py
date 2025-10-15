from rest_framework.routers import DefaultRouter
from properties.views import PropertyViewSet

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')

urlpatterns = router.urls
