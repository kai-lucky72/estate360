from rest_framework import serializers
from .models import Property, PropertyImage, PropertyDocument


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image", "caption"]


class PropertyDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyDocument
        fields = ["id", "file", "name"]


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, required=False)
    documents = PropertyDocumentSerializer(many=True, required=False)
    agent_name = serializers.CharField(source="agent.username", read_only=True)

    class Meta:
        model = Property
        fields = [
            "id", "title", "description", "price", "location",
            "agent", "agent_name", "is_available",
            "images", "documents", "created_at"
        ]

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        documents_data = validated_data.pop("documents", [])
        property_obj = Property.objects.create(**validated_data)

        for img in images_data:
            PropertyImage.objects.create(property=property_obj, **img)
        for doc in documents_data:
            PropertyDocument.objects.create(property=property_obj, **doc)

        return property_obj
