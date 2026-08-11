# Backend Startup Checklist

## 1. Start MySQL Database
```bash
# Mac/Linux
sudo service mysql start
# OR
mysql.server start

# Windows (Run as Administrator)
net start MySQL80
```

## 2. Verify MySQL is Running
```bash
mysql -u root -p -e "SELECT 1"
```

## 3. Create/Verify Database
If it's failing locally, you can use the check-database script:
```bash
mysql -u root -p < check-database.sql
```

## 4. Build and Run Spring Boot (Using Convenience Script)
```bash
# Windows
start-backend.bat

# Unix
./start-backend.sh
```

## 5. Verify Backend is Running
```bash
# In new terminal
curl http://localhost:8080/api/health
# Should return: {"status":"UP", "message": "Backend is running!", ...}
```

## 6. Start Frontend
```bash
cd frontend
npm run dev
```

## 7. Test Full Stack
Open browser to `http://localhost:5000` (or 5173). Check browser console for errors. 

---

### Troubleshooting Commands

**Missing Port? Kill hanging instances:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Check Java Version:**
```bash
java -version  # Must be Java 17 or higher
```
