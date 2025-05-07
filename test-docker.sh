#!/bin/bash

# Exit on error
set -e

echo "Testing Docker setup..."

# Build the Docker image
echo "Building Docker image..."
docker build -t salvage-inspection-backend .

# Start the containers with Docker Compose
echo "Starting containers with Docker Compose..."
docker-compose up -d

# Wait for the application to start
echo "Waiting for the application to start..."
sleep 10

# Check if the application is running
echo "Checking if the application is running..."
if curl -s http://localhost:3000 > /dev/null; then
  echo "Application is running!"
else
  echo "Application is not running. Check the logs with 'docker-compose logs app'"
  docker-compose logs app
  docker-compose down
  exit 1
fi

# Check if the application can connect to the database and Redis
echo "Checking application logs for connection issues..."
if docker-compose logs app | grep -i "error"; then
  echo "Found errors in the application logs. Check the logs with 'docker-compose logs app'"
  docker-compose logs app
  docker-compose down
  exit 1
fi

echo "Docker setup test completed successfully!"
echo "Stopping containers..."
docker-compose down

echo "You can start the application again with 'docker-compose up -d'"