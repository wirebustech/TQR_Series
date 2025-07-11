# TQRS CMS Installation Guide

This guide provides step-by-step instructions for installing The Qualitative Research Series (TQRS) CMS on localhost and deploying to Azure cloud.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Installation](#local-installation)
- [Azure Cloud Deployment](#azure-cloud-deployment)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

---

## 🔧 Prerequisites

### For Local Development
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **MySQL** (v8.0 or higher) - Local installation
- **Git** for version control
- **Code editor** (VS Code recommended)

### For Azure Deployment
- **Azure Account** with active subscription
- **Azure CLI** installed and configured
- **Git** for deployment
- **Domain name** (optional, for custom URLs)

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 2GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux

---

## 🏠 Local Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/tqrs-cms.git
cd tqrs-cms

# Verify the structure
ls -la
# Should show: server/, client/, admin/, package.json, README.md, etc.
```

### Step 2: Automated Setup (Recommended)

```bash
# Run the automated setup script
npm run setup

# This will:
# - Install all dependencies
# - Create environment files
# - Set up directories
# - Provide next steps
```

### Step 3: Manual Setup (Alternative)

If you prefer manual setup or the automated script fails:

```bash
# Install dependencies for all projects
npm run install:all

# Or install individually:
cd server && npm install
cd ../client && npm install
cd ../admin && npm install
cd ..
```

### Step 4: Database Setup

#### Option A: Using MySQL Command Line

```bash
# Access MySQL
mysql -u root -p

# Create database
CREATE DATABASE tqrs_cms;
USE tqrs_cms;

# Exit MySQL
exit

# Import schema
mysql -u root -p tqrs_cms < server/database/schema.sql
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create a new database named `tqrs_cms`
4. Open the file `server/database/schema.sql`
5. Execute the entire script

### Step 5: Environment Configuration

```bash
# Copy environment template
cp server/env.example server/.env

# Edit the environment file
nano server/.env  # or use your preferred editor
```

**Required Configuration:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tqrs_cms
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

**Email Setup Notes:**
- For Gmail, use an **App Password** instead of your regular password
- Enable 2-factor authentication on your Google account
- Generate an App Password: Google Account → Security → App Passwords

### Step 6: Start the Application

#### Development Mode (All Services)

```bash
# Start all services simultaneously
npm run dev

# This starts:
# - Backend: http://localhost:5000
# - Frontend: http://localhost:3000
# - Admin Portal: http://localhost:3001
```

#### Individual Services

```bash
# Backend only
npm run dev:server

# Frontend only
npm run dev:client

# Admin Portal only
npm run dev:admin
```

### Step 7: Verify Installation

1. **Backend Health Check**: http://localhost:5000/api/health
2. **Frontend**: http://localhost:3000
3. **Admin Portal**: http://localhost:3001

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

**⚠️ Important**: Change the default password immediately!

---

## ☁️ Azure Cloud Deployment

### Step 1: Azure Account Setup

1. **Create Azure Account** (if you don't have one)
   - Visit [azure.microsoft.com](https://azure.microsoft.com)
   - Sign up for a free account (includes $200 credit)

2. **Install Azure CLI**
   ```bash
   # Windows (using winget)
   winget install Microsoft.AzureCLI

   # macOS
   brew install azure-cli

   # Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

3. **Login to Azure**
   ```bash
   az login
   # This opens a browser window for authentication
   ```

### Step 2: Create Azure Resources

#### Option A: Using Azure Portal (GUI)

1. **Create Resource Group**
   - Go to Azure Portal
   - Click "Create a resource"
   - Search for "Resource group"
   - Name: `tqrs-cms-rg`
   - Region: Choose closest to your users

2. **Create MySQL Database**
   - Search for "Azure Database for MySQL"
   - Choose "Flexible server"
   - Configuration:
     - Server name: `tqrs-mysql-server`
     - Admin username: `tqrsadmin`
     - Password: `SecurePassword123!`
     - Database name: `tqrs_cms`

3. **Create App Service**
   - Search for "App Service"
   - Choose "Web App"
   - Configuration:
     - App name: `tqrs-backend`
     - Runtime stack: Node.js 18 LTS
     - Operating System: Linux

4. **Create Static Web App**
   - Search for "Static Web App"
   - Configuration:
     - App name: `tqrs-frontend`
     - Build details: Configure later

#### Option B: Using Azure CLI (Command Line)

```bash
# Set variables
RESOURCE_GROUP="tqrs-cms-rg"
LOCATION="eastus"
MYSQL_SERVER="tqrs-mysql-server"
APP_SERVICE="tqrs-backend"
STATIC_WEB_APP="tqrs-frontend"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create MySQL Flexible Server
az mysql flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $MYSQL_SERVER \
  --admin-user tqrsadmin \
  --admin-password "SecurePassword123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 20

# Create database
az mysql flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $MYSQL_SERVER \
  --database-name tqrs_cms

# Create App Service Plan
az appservice plan create \
  --name tqrs-app-plan \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Create Web App for backend
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan tqrs-app-plan \
  --name $APP_SERVICE \
  --runtime "NODE|18-lts"

# Create Static Web App
az staticwebapp create \
  --name $STATIC_WEB_APP \
  --resource-group $RESOURCE_GROUP \
  --source https://github.com/your-org/tqrs-cms \
  --location $LOCATION
```

### Step 3: Configure Database

1. **Get MySQL Connection Details**
   ```bash
   # Get connection string
   az mysql flexible-server show \
     --resource-group $RESOURCE_GROUP \
     --name $MYSQL_SERVER \
     --query "fullyQualifiedDomainName"
   ```

2. **Import Database Schema**
   ```bash
   # Connect to Azure MySQL
   mysql -h tqrs-mysql-server.mysql.database.azure.com \
     -u tqrsadmin@tqrs-mysql-server \
     -p \
     tqrs_cms < server/database/schema.sql
   ```

### Step 4: Configure Environment Variables

#### Backend Configuration

```bash
# Set environment variables for the web app
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE \
  --settings \
    NODE_ENV=production \
    DB_HOST=tqrs-mysql-server.mysql.database.azure.com \
    DB_USER=tqrsadmin@tqrs-mysql-server \
    DB_PASSWORD=SecurePassword123! \
    DB_NAME=tqrs_cms \
    DB_PORT=3306 \
    JWT_SECRET=your_production_jwt_secret_here \
    JWT_EXPIRES_IN=24h \
    EMAIL_HOST=smtp.gmail.com \
    EMAIL_PORT=587 \
    EMAIL_USER=your_email@gmail.com \
    EMAIL_PASS=your_app_password \
    CORS_ORIGIN=https://tqrs-frontend.azurestaticapps.net
```

### Step 5: Deploy Backend

#### Option A: Using Azure CLI

```bash
# Navigate to server directory
cd server

# Deploy to Azure App Service
az webapp deployment source config-local-git \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE

# Get deployment URL
DEPLOYMENT_URL=$(az webapp deployment source config-local-git \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE \
  --query url \
  --output tsv)

# Add Azure remote
git remote add azure $DEPLOYMENT_URL

# Deploy
git add .
git commit -m "Deploy to Azure"
git push azure main
```

#### Option B: Using GitHub Actions

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/tqrs-cms.git
   git push -u origin main
   ```

2. **Create GitHub Actions Workflow**
   Create `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to Azure
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy-backend:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v3
       
       - name: Set up Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           
       - name: Deploy to Azure Web App
         uses: azure/webapps-deploy@v2
         with:
           app-name: 'tqrs-backend'
           publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
           package: ./server
   ```

### Step 6: Deploy Frontend and Admin

#### Using Azure Static Web Apps

1. **Configure Build Settings**
   - Go to Azure Portal → Static Web App
   - Navigate to "Configuration" → "Build configuration"
   - Set build configuration:

   ```json
   {
     "appLocation": "/client",
     "apiLocation": "/server",
     "outputLocation": "dist",
     "appBuildCommand": "npm run build",
     "apiBuildCommand": "npm run build"
   }
   ```

2. **Deploy via GitHub**
   - Connect your GitHub repository
   - Azure will automatically deploy on push to main branch

#### Manual Deployment

```bash
# Build frontend
cd client
npm run build

# Build admin
cd ../admin
npm run build

# Deploy to Azure Storage or CDN
# (Use Azure CLI or Azure Storage Explorer)
```

### Step 7: Configure Custom Domain (Optional)

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name $APP_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --hostname your-domain.com

# Configure SSL certificate
az webapp config ssl bind \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI \
  --name $APP_SERVICE \
  --resource-group $RESOURCE_GROUP
```

---

## ⚙️ Configuration

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `DB_HOST` | Database host | `localhost` or Azure hostname |
| `DB_USER` | Database username | `root` or Azure username |
| `DB_PASSWORD` | Database password | Your MySQL password |
| `DB_NAME` | Database name | `tqrs_cms` |
| `JWT_SECRET` | JWT signing secret | Long random string |
| `EMAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `EMAIL_USER` | Email username | `your@gmail.com` |
| `EMAIL_PASS` | Email password/app password | Your email password |
| `CORS_ORIGIN` | Allowed origins | `http://localhost:3000` |

### Email Configuration

#### Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password: Google Account → Security → App Passwords
3. Use App Password in `EMAIL_PASS`

#### Other Email Providers
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's settings

### Security Best Practices

1. **Change Default Passwords**
   ```sql
   -- Update admin password
   UPDATE users SET password_hash = 'new_hashed_password' WHERE username = 'admin';
   ```

2. **Use Strong JWT Secrets**
   ```bash
   # Generate secure JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Enable HTTPS in Production**
   - Azure App Service includes HTTPS by default
   - Configure SSL certificates for custom domains

---

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues

**Error**: `ECONNREFUSED` or `Access denied`

**Solutions**:
```bash
# Check MySQL service
sudo systemctl status mysql

# Start MySQL if stopped
sudo systemctl start mysql

# Check MySQL user permissions
mysql -u root -p
SHOW GRANTS FOR 'your_user'@'localhost';
```

#### Port Already in Use

**Error**: `EADDRINUSE`

**Solutions**:
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

#### Email Sending Issues

**Error**: `Authentication failed`

**Solutions**:
1. Check email credentials in `.env`
2. For Gmail, use App Password instead of regular password
3. Enable "Less secure app access" (not recommended)
4. Check firewall/antivirus blocking SMTP

#### Azure Deployment Issues

**Error**: `Deployment failed`

**Solutions**:
```bash
# Check Azure CLI login
az account show

# Check resource group
az group show --name tqrs-cms-rg

# Check web app status
az webapp show --name tqrs-backend --resource-group tqrs-cms-rg
```

### Performance Optimization

#### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_apps_status ON apps(status);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_early_access_app_id ON early_access_signups(app_id);
```

#### Caching
```javascript
// Add Redis caching for frequently accessed data
const redis = require('redis');
const client = redis.createClient();
```

### Monitoring and Logs

#### Local Logs
```bash
# Backend logs
cd server
npm run dev

# Check error logs
tail -f server/logs/error.log
```

#### Azure Logs
```bash
# Stream application logs
az webapp log tail --name tqrs-backend --resource-group tqrs-cms-rg

# Download logs
az webapp log download --name tqrs-backend --resource-group tqrs-cms-rg
```

---

## 🛠️ Maintenance

### Regular Tasks

#### Daily
- Check application health: `curl http://localhost:5000/api/health`
- Monitor error logs
- Check email delivery status

#### Weekly
- Update dependencies: `npm update`
- Backup database
- Review security logs

#### Monthly
- Update Node.js version
- Review and rotate secrets
- Performance analysis
- Security audit

### Backup Procedures

#### Database Backup
```bash
# Local backup
mysqldump -u root -p tqrs_cms > backup_$(date +%Y%m%d).sql

# Azure backup
az mysql flexible-server backup create \
  --resource-group tqrs-cms-rg \
  --name tqrs-mysql-server
```

#### File Backup
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz server/uploads/

# Backup configuration
cp server/.env backup_env_$(date +%Y%m%d)
```

### Updates and Upgrades

#### Application Updates
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm run install:all

# Restart services
npm run dev
```

#### Database Migrations
```sql
-- Run new migrations
SOURCE server/database/migrations/new_migration.sql;

-- Verify data integrity
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM apps;
```

---

## 📞 Support

### Getting Help

1. **Check Documentation**: Review README.md and this HOWTO.md
2. **Search Issues**: Check GitHub issues for similar problems
3. **Create Issue**: Report bugs or request features
4. **Contact Support**: Email support@tqrs.com

### Useful Commands

```bash
# Health check
curl http://localhost:5000/api/health

# Check Node.js version
node --version

# Check npm version
npm --version

# Check MySQL version
mysql --version

# Check Azure CLI version
az --version

# List all processes
ps aux | grep node

# Check disk space
df -h

# Check memory usage
free -h
```

---

## 🎉 Success Checklist

### Local Installation
- [ ] Repository cloned successfully
- [ ] Dependencies installed
- [ ] Database created and schema imported
- [ ] Environment variables configured
- [ ] All services start without errors
- [ ] Can access frontend at http://localhost:3000
- [ ] Can access admin portal at http://localhost:3001
- [ ] Can log in with admin credentials
- [ ] Email notifications working

### Azure Deployment
- [ ] Azure account created and configured
- [ ] Resource group created
- [ ] MySQL database deployed and configured
- [ ] App Service created and configured
- [ ] Static Web App created and configured
- [ ] Environment variables set
- [ ] Application deployed successfully
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate installed
- [ ] Monitoring and logging configured

---

**🎯 You're all set! The TQRS CMS is now ready to empower research excellence!**

For additional help or questions, please refer to the main README.md or contact the TQRS team. 