from rest_framework import serializers
from .models import Contract
from properties.serializers import PropertySerializer
from booking.serializers import BookingSerializer


class ContractSerializer(serializers.ModelSerializer):
    booking_details = BookingSerializer(source="booking", read_only=True)
    property_details = PropertySerializer(source="property", read_only=True)
    client_name = serializers.CharField(source="client.username", read_only=True)
    agent_name = serializers.CharField(source="agent.username", read_only=True)

    class Meta:
        model = Contract
        fields = [
            "id",
            "booking",
            "booking_details",
            "property",
            "property_details",
            "client",
            "client_name",
            "agent",
            "agent_name",
            "start_date",
            "end_date",
            "rent_amount",
            "terms",
            "client_signed",
            "agent_signed",
            "status",
            "is_fully_signed",
            "created_at",
        ]
        read_only_fields = ["property", "agent", "client"]

    def create(self, validated_data):
        # Automatically derive agent and property from booking
        booking = validated_data["booking"]
        validated_data["property"] = booking.property
        validated_data["agent"] = booking.agent
        validated_data["client"] = booking.client
        return super().create(validated_data)
