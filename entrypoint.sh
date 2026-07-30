#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

PORT="${PORT:-8000}"

echo "Starting Daphne ASGI server on port ${PORT}..."
exec daphne -b 0.0.0.0 -p "${PORT}" estate.asgi:application
