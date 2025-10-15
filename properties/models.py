from django.db import models
from accounts.models import User

class Property(models.Model):
    STATUS = [('available', 'Available'), ('booked', 'Booked'), ('rented', 'Rented'), ('sold', 'Sold')]
    CATEGORY = [
        ('apartment', 'Apartment'),
        ('house', 'House'),
        ('villa', 'Villa'),
        ('land', 'Land'),
        ('office', 'Office'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_properties')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY)
    location = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    size_sqft = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='available')
    main_image = models.ImageField(upload_to='properties/', blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.location}"

    class Meta:
        ordering = ['-date_added']


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="properties/images/")
    caption = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Image for {self.property.title}"


class PropertyDocument(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="documents")
    file = models.FileField(upload_to="properties/docs/")
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"Document: {self.name}"