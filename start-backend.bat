@echo off
echo === Starting Alumni Connect Backend ===
cd backend

echo Cleaning previous build...
call mvn clean

echo Building project...
call mvn compile

echo Running Spring Boot application...
call mvn spring-boot:run
