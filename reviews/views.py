from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer
from core.permissions import IsOwnerOrAdmin

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]
