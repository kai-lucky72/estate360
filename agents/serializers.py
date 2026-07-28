from rest_framework import serializers
from .models import Agent, AgentPropertyAssignment, Commission
from properties.serializers import PropertySerializer
from accounts.serializers import UserSerializer

class AgentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Agent
        fields = ["id", "user", "bio", "license_number", "phone", "profile_image", "verified", "rating"]

    def get_profile_image(self, obj):
        request = self.context.get('request')
        # Prefer Agent-level profile_image, fall back to user's
        img = obj.profile_image or (obj.user.profile_image if obj.user else None)
        if img and hasattr(img, 'url'):
            return request.build_absolute_uri(img.url) if request else img.url
        return None

class AgentPropertyAssignmentSerializer(serializers.ModelSerializer):
    property = PropertySerializer()
    class Meta:
        model = AgentPropertyAssignment
        fields = "__all__"

class CommissionSerializer(serializers.ModelSerializer):
    property = PropertySerializer()
    class Meta:
        model = Commission
        fields = "__all__"
