#!/bin/bash
# start-backend.sh
echo "=== Starting Alumni Connect Backend ==="
cd backend

# Clean and build
echo "Cleaning previous build..."
mvn clean

echo "Building project..."
mvn compile

echo "Running Spring Boot application..."
mvn spring-boot:run
