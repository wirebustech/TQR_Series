# The Qualitative Research Series (TQRS) CMS

A modern, full-stack Content Management System for The Qualitative Research Series, featuring a dynamic frontend, robust backend API, and comprehensive admin portal.

## 🚀 Features

### Frontend (Client)
- **Modern UI/UX**: Built with React, Vite, and Tailwind CSS
- **Dynamic Content**: All content managed through admin portal
- **Responsive Design**: Mobile-first approach
- **Key Pages**:
  - Home with hero section and featured content
  - About TQRS with mission and vision
  - Services showcasing research tools and consultation
  - Apps page with early access signup
  - Webinars/Courses with video integration
  - Support/Contact with contribution options

### Backend (Server)
- **RESTful API**: Node.js/Express with comprehensive endpoints
- **Database**: MySQL with local and Azure support
- **Authentication**: JWT-based with role-based access control
- **Email System**: Nodemailer integration for notifications
- **File Upload**: Multer for image and document management

### Admin Portal
- **Content Management**: Dynamic sections, blogs, social media
- **App Management**: Create, update, and manage TQRS applications
- **User Management**: Role-based user administration
- **Email Notifications**: Bulk email to early access users
- **Analytics**: View submissions, signups, and engagement

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router
- React Hot Toast

### Backend
- Node.js
- Express.js
- MySQL2
- JWT Authentication
- Nodemailer
- Multer
- Express Validator

### Database
- MySQL (Local & Azure)
- Comprehensive schema for all CMS features

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (local or Azure)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TQR_Series
```

### 2. Backend Setup
```bash
cd server
npm install
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tqrs_cms
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### 3. Database Setup
```bash
# Create database and tables
mysql -u root -p < database/schema.sql
```

### 4. Frontend Setup
```bash
cd ../client
npm install
```

### 5. Admin Portal Setup
```bash
cd ../admin
npm install
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend**:
```bash
cd server
npm run dev
```

2. **Start Frontend**:
```bash
cd client
npm run dev
```

3. **Start Admin Portal**:
```bash
cd admin
npm run dev
```

### Production Mode
```bash
# Backend
cd server
npm start

# Frontend
cd client
npm run build
npm run preview

# Admin Portal
cd admin
npm run build
npm run preview
```

## 📧 Email Notification System

### Setup
1. Configure SMTP settings in `.env`
2. For Gmail, use App Password instead of regular password
3. Test email configuration

### Usage in Admin Portal

#### Notifying Early Access Users
1. Navigate to **Apps** in the admin portal
2. Click **"Notify Early Access"** for any app
3. Fill in the notification modal:
   - **Subject**: Email subject line
   - **Message**: Email content (use `{{name}}` for personalization)
4. Click **"Send Notification"**

#### Email Templates
The system includes pre-built templates:
- Early Access Notification
- App Launch Announcement

#### Personalization
Use `{{name}}` in your message to personalize emails:
```
Hi {{name}},

We're excited to announce that [App Name] is now available for early access!
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Content Management
- `GET /api/content/sections` - Get all content sections
- `PUT /api/content/sections/:id` - Update content section

### Apps Management
- `GET /api/apps` - Get public apps
- `POST /api/apps` - Create new app (admin/editor)
- `PUT /api/apps/:id` - Update app (admin/editor)
- `POST /api/apps/:id/signup` - Early access signup
- `POST /api/apps/:id/notify-early-access` - Notify early access users

### Blogs
- `GET /api/blogs` - Get published blogs
- `POST /api/blogs` - Create blog (admin/editor)
- `PUT /api/blogs/:id` - Update blog (admin/editor)

### Webinars
- `GET /api/webinars` - Get active webinars
- `POST /api/webinars` - Create webinar (admin/editor)

### Support
- `POST /api/support/contact` - Submit contact form
- `POST /api/support/contribute` - Submit contribution

## 👥 User Roles

### Admin
- Full access to all features
- User management
- System configuration

### Editor
- Content management
- App management
- Email notifications
- Blog and webinar management

### Viewer
- Read-only access to admin portal
- View analytics and reports

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Rate limiting
- Helmet.js security headers

## 📊 Database Schema

The system includes tables for:
- Users and authentication
- Content sections
- Blog posts
- Social media links
- Affiliates
- Webinars/Courses
- Apps and early access signups
- Support contributions
- Contact submissions
- File uploads

## 🚀 Deployment

### Local Development
- Use local MySQL instance
- Configure environment variables
- Run all services in development mode

### Production (Azure)
1. Set up Azure MySQL Database
2. Configure production environment variables
3. Deploy backend to Azure App Service
4. Deploy frontend and admin to Azure Static Web Apps
5. Configure custom domains and SSL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@tqrs.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

---

**The Qualitative Research Series (TQRS)** - Empowering research excellence through innovative solutions and collaborative partnerships. 