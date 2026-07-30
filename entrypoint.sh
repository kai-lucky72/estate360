#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

if [ -n "$SUPERUSER_EMAIL" ] && [ -n "$SUPERUSER_PASSWORD" ]; then
    echo "Creating superuser ${SUPERUSER_EMAIL}..."
    python manage.py createsuperuser --noinput --username admin --email "$SUPERUSER_EMAIL" 2>/dev/null || echo "Superuser already exists."
fi

PORT="${PORT:-8000}"

echo "Starting Daphne ASGI server on port ${PORT}..."
exec daphne -b 0.0.0.0 -p "${PORT}" estate.asgi:application
