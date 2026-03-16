# Bank Employee Fraud Monitoring System - Run Instructions

## Quick Start Guide

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Step 1: Database Setup

1. **Install MySQL** if not already installed
2. **Create Database**:
   ```bash
   mysql -u root -p
   ```
   Then run:
   ```sql
   CREATE DATABASE bank_fraud_db;
   ```
   
3. **Optional**: Run the setup script for additional configuration:
   ```bash
   mysql -u root -p < setup.sql
   ```

### Step 2: Backend Setup

1. **Navigate to Backend Directory**:
   ```bash
   cd backend
   ```

2. **Configure Database Connection**:
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bank_fraud_db
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

3. **Build and Run Backend**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   
   The backend will start on `http://localhost:8080`

4. **Verify Backend is Running**:
   Open browser and go to `http://localhost:8080/api/dashboard/stats`
   You should see JSON response with dashboard statistics.

### Step 3: Frontend Setup

1. **Navigate to Frontend Directory** (in a new terminal):
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   
   If you prefer yarn:
   ```bash
   yarn install
   ```

3. **Start Frontend Development Server**:
   ```bash
   npm start
   ```
   
   Or with yarn:
   ```bash
   yarn start
   ```

4. **Access the Application**:
   Open browser and go to `http://localhost:3000`

### Step 4: Login to the System

Use these demo credentials:

**Admin Login:**
- Email: `admin@bank.com`
- Password: `admin123`

**Sample Employee Logins:**
- Email: `john.smith@bank.com` (Teller)
- Email: `sarah.johnson@bank.com` (Manager)
- Email: `michael.brown@bank.com` (Auditor)
- Password: `password123` (for all sample accounts)

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure MySQL is running
   - Check database credentials in application.properties
   - Verify database name is correct

2. **Port Already in Use**:
   - Backend: Change port in application.properties (`server.port=8081`)
   - Frontend: The system will automatically suggest an alternative port

3. **Maven Build Errors**:
   - Run `mvn clean install -DskipTests` to skip tests during initial setup
   - Ensure Java 17+ is installed and configured

4. **Node.js Version Issues**:
   - Ensure Node.js 16+ is installed
   - Run `node --version` to check version

5. **CORS Errors**:
   - The backend is configured for CORS with `http://localhost:3000`
   - If using a different port, update `application.properties`

### Verification Steps

1. **Backend Health Check**:
   ```bash
   curl http://localhost:8080/api/dashboard/stats
   ```

2. **Database Tables Created**:
   ```sql
   USE bank_fraud_db;
   SHOW TABLES;
   ```

3. **Sample Data Created**:
   ```sql
   SELECT * FROM employees;
   ```

4. **Frontend Loading**:
   - Open browser dev tools (F12)
   - Check for any JavaScript errors in console

## Development Mode

### Backend Development
- Use `mvn spring-boot:run` for hot reload
- Application will auto-restart on code changes
- Logs will appear in console

### Frontend Development
- Use `npm start` for hot reload
- Browser will auto-refresh on file changes
- React DevTools recommended for debugging

## Production Deployment

### Backend Production Build
```bash
mvn clean package
java -jar target/fraud-monitoring-1.0.0.jar
```

### Frontend Production Build
```bash
npm run build
```
The build files will be in the `build/` directory.

## API Documentation

Once the backend is running, you can access:
- Swagger UI: `http://localhost:8080/swagger-ui.html` (if configured)
- API endpoints: `http://localhost:8080/api/*`

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure database connection is working
4. Check that ports are not blocked by firewall

For additional help, refer to the main README.md file or create an issue in the repository.
