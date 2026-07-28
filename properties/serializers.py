from rest_framework import serializers
from .models import Property, PropertyImage, PropertyDocument


class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ["id", "image", "caption"]

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class PropertyDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyDocument
        fields = ["id", "file", "name"]


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, required=False)
    documents = PropertyDocumentSerializer(many=True, required=False)
    owner_username = serializers.CharField(source="owner.username", read_only=True)
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id", "title", "description", "price", "location",
            "owner", "owner_username", "status", "category",
            "size_sqft", "main_image", "images", "documents", "date_added"
        ]
        read_only_fields = ["owner"]

    def get_main_image(self, obj):
        request = self.context.get('request')
        if obj.main_image and hasattr(obj.main_image, 'url'):
            return request.build_absolute_uri(obj.main_image.url) if request else obj.main_image.url
        return None

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        documents_data = validated_data.pop("documents", [])
        property_obj = Property.objects.create(**validated_data)

        for img in images_data:
            PropertyImage.objects.create(property=property_obj, **img)
        for doc in documents_data:
            PropertyDocument.objects.create(property=property_obj, **doc)

        return property_obj
