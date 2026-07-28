#!/bin/bash
echo "Starting backend..."
docker-compose up -d --build

echo "Waiting for backend..."
until curl -s http://localhost:8000/api/health/ > /dev/null 2>&1; do
  sleep 2
done

echo "Seeding database..."
docker-compose exec -T web python manage.py shell -c "exec(open('seed_db.py').read())" 2>/dev/null

echo "Starting frontend..."
cd frontend && npm run dev
