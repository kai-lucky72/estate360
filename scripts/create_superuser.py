import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "estate.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = os.environ.get("SUPERUSER_USERNAME", "admin")
email = os.environ.get("SUPERUSER_EMAIL", "admin@estate360.com")
password = os.environ.get("SUPERUSER_PASSWORD", "Admin@123456")

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superuser '{username}' created successfully.")
else:
    print(f"Superuser '{username}' already exists.")
