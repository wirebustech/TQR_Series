#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up TQRS CMS...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Check if Node.js is installed
try {
  const nodeVersion = process.version;
  log(`✓ Node.js ${nodeVersion} detected`, 'green');
} catch (error) {
  log('✗ Node.js is not installed. Please install Node.js v16 or higher.', 'red');
  process.exit(1);
}

// Install dependencies for all projects
log('\n📦 Installing dependencies...', 'blue');

const projects = ['server', 'client', 'admin'];

projects.forEach(project => {
  if (fs.existsSync(path.join(__dirname, project))) {
    log(`Installing dependencies for ${project}...`, 'yellow');
    try {
      execSync('npm install', { 
        cwd: path.join(__dirname, project), 
        stdio: 'inherit' 
      });
      log(`✓ ${project} dependencies installed`, 'green');
    } catch (error) {
      log(`✗ Failed to install dependencies for ${project}`, 'red');
    }
  }
});

// Create environment file if it doesn't exist
const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', 'env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  log('\n⚙️  Creating environment configuration...', 'blue');
  try {
    fs.copyFileSync(envExamplePath, envPath);
    log('✓ Environment file created from template', 'green');
    log('⚠️  Please edit server/.env with your configuration', 'yellow');
  } catch (error) {
    log('✗ Failed to create environment file', 'red');
  }
}

// Check if MySQL is accessible
log('\n🗄️  Checking database connection...', 'blue');
try {
  // This is a basic check - in production, you'd want more robust database setup
  log('⚠️  Please ensure MySQL is running and configured in server/.env', 'yellow');
} catch (error) {
  log('✗ Database connection failed', 'red');
}

// Create uploads directory
const uploadsPath = path.join(__dirname, 'server', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  log('\n📁 Creating uploads directory...', 'blue');
  try {
    fs.mkdirSync(uploadsPath, { recursive: true });
    log('✓ Uploads directory created', 'green');
  } catch (error) {
    log('✗ Failed to create uploads directory', 'red');
  }
}

// Display next steps
log('\n🎉 Setup completed!', 'green');
log('\n📋 Next steps:', 'blue');
log('1. Edit server/.env with your database and email configuration', 'yellow');
log('2. Create the database: mysql -u root -p < server/database/schema.sql', 'yellow');
log('3. Start the backend: cd server && npm run dev', 'yellow');
log('4. Start the frontend: cd client && npm run dev', 'yellow');
log('5. Start the admin portal: cd admin && npm run dev', 'yellow');
log('\n🌐 Access URLs:', 'blue');
log('- Frontend: http://localhost:3000', 'yellow');
log('- Admin Portal: http://localhost:3001', 'yellow');
log('- Backend API: http://localhost:5000', 'yellow');
log('\n🔐 Default admin credentials:', 'blue');
log('- Username: admin', 'yellow');
log('- Password: admin123', 'yellow');
log('\n⚠️  Remember to change the default password!', 'red');

console.log('\nHappy coding! 🚀'); 