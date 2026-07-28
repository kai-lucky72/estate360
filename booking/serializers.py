from rest_framework import serializers
from .models import Booking
from properties.serializers import PropertySerializer


class BookingSerializer(serializers.ModelSerializer):
    property_details = PropertySerializer(source="property", read_only=True)
    client_name = serializers.CharField(source="client.username", read_only=True)
    agent_name = serializers.CharField(source="agent.username", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "property",
            "property_details",
            "client",
            "client_name",
            "agent",
            "agent_name",
            "scheduled_date",
            "scheduled_time",
            "status",
            "notes",
            "created_at",
        ]
        read_only_fields = ["client", "agent"]

    def create(self, validated_data):
        property_instance = validated_data["property"]
        validated_data["agent"] = property_instance.owner
        return super().create(validated_data)
