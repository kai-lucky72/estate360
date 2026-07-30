#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

if [ -n "$SUPERUSER_EMAIL" ] && [ -n "$SUPERUSER_PASSWORD" ]; then
    python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'estate.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser(username='admin', email=os.environ['SUPERUSER_EMAIL'], password=os.environ['SUPERUSER_PASSWORD'])
    print('Superuser created.')
else:
    print('Superuser already exists, skipping.')
"
fi

PORT="${PORT:-8000}"

echo "Starting Daphne ASGI server on port ${PORT}..."
exec daphne -b 0.0.0.0 -p "${PORT}" estate.asgi:application
