# The Quality Research Series (TQRS) CMS

A modern, full-stack Content Management System for The Quality Research Series organization, featuring a dynamic frontend, robust backend API, and comprehensive admin portal.

## 🚀 Features

### Frontend (Public Website)
- **Modern React Application** with Tailwind CSS
- **Dynamic Content Management** - All content editable through admin portal
- **Responsive Design** - Mobile-first approach
- **Blog System** - Full-featured blog with markdown support
- **Webinar/Course Management** - Video content and registration
- **App Showcase** - Early access signups for TQRS applications
- **Support/Contribution System** - Donations and partnerships
- **Social Media Integration** - Dynamic social media links
- **Affiliate/Partner Showcase** - Partner organizations and logos

### Backend API
- **Node.js/Express Server** with MySQL database
- **JWT Authentication** for secure admin access
- **Role-based Access Control** (Admin, Editor, Viewer)
- **RESTful API** with comprehensive endpoints
- **File Upload System** for images and documents
- **Database Support** - Local MySQL and Azure MySQL for production
- **Security Features** - Rate limiting, CORS, input validation

### Admin Portal
- **Modern Admin Interface** with React and Tailwind CSS
- **Content Management** - Edit all website sections
- **Blog Management** - Create, edit, and publish blog posts
- **Webinar Management** - Manage educational content
- **App Management** - Manage TQRS applications and early access
- **Social Media Management** - Update social media links
- **Affiliate Management** - Manage partner organizations
- **Support Management** - Handle contributions and contact forms
- **User Management** - Manage admin users and roles
- **Analytics Dashboard** - View statistics and insights

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for forms
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MySQL** database (local and Azure)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Express Validator** for input validation

### Admin Portal
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Quill** for rich text editing
- **React Dropzone** for file uploads
- **Recharts** for data visualization

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TQR_Series
```

### 2. Install Dependencies
```bash
# Install all dependencies for all projects
npm run install:all
```

### 3. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE tqrs_cms;
USE tqrs_cms;

# Import schema
mysql -u root -p tqrs_cms < server/database/schema.sql
```

### 4. Environment Configuration
```bash
# Copy environment template
cp server/env.example server/.env

# Edit server/.env with your configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tqrs_cms
JWT_SECRET=your_jwt_secret_key_here
```

### 5. Start Development Servers
```bash
# Start all servers (backend, frontend, admin)
npm run dev

# Or start individually:
npm run server    # Backend (port 5000)
npm run client    # Frontend (port 3000)
npm run admin     # Admin portal (port 3001)
```

## 🌐 Access URLs

- **Frontend Website**: http://localhost:3000
- **Admin Portal**: http://localhost:3001
- **Backend API**: http://localhost:5000

## 🔐 Default Admin Credentials

- **Username**: admin
- **Password**: admin123

**⚠️ Important**: Change the default password immediately after first login!

## 📁 Project Structure

```
TQR_Series/
├── server/                 # Backend API
│   ├── config/            # Database configuration
│   ├── database/          # Database schema and migrations
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads
│   ├── index.js           # Main server file
│   └── package.json
├── client/                # Frontend website
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
├── admin/                 # Admin portal
│   ├── src/
│   │   ├── components/    # Admin components
│   │   ├── pages/         # Admin pages
│   │   ├── contexts/      # React contexts
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password

### Content Management
- `GET /api/content/sections` - Get all content sections
- `PUT /api/content/sections/:id` - Update content section
- `POST /api/content/sections` - Create new section

### Blog Management
- `GET /api/blogs` - Get published blog posts
- `POST /api/blogs` - Create new blog post
- `PUT /api/blogs/:id` - Update blog post
- `DELETE /api/blogs/:id` - Delete blog post

### Webinar Management
- `GET /api/webinars` - Get all webinars
- `POST /api/webinars` - Create new webinar
- `PUT /api/webinars/:id` - Update webinar

### App Management
- `GET /api/apps` - Get all apps
- `POST /api/apps` - Create new app
- `POST /api/apps/:id/signup` - Early access signup

### Social Media
- `GET /api/social-media` - Get social media links
- `POST /api/social-media` - Add social media link
- `PUT /api/social-media/:id` - Update social media link

### Support & Contact
- `POST /api/support/contribute` - Submit contribution
- `POST /api/support/contact` - Submit contact form
- `GET /api/support/contributions` - Get contributions (admin)
- `GET /api/support/contacts` - Get contact submissions (admin)

## 🚀 Deployment

### Production Environment Variables
```bash
NODE_ENV=production
DB_HOST=your_azure_host
DB_USER=your_azure_user
DB_PASSWORD=your_azure_password
DB_NAME=your_azure_db_name
JWT_SECRET=your_secure_jwt_secret
```

### Build for Production
```bash
# Build all applications
npm run build

# The built files will be in:
# - server/ (ready to deploy)
# - client/dist/
# - admin/dist/
```

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Role-based Access Control** (Admin, Editor, Viewer)
- **Input Validation** with express-validator
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for secure cross-origin requests
- **Password Hashing** with bcryptjs
- **SQL Injection Prevention** with parameterized queries

## 📊 Database Schema

The system includes tables for:
- **Users** - Admin user management
- **Content Sections** - Dynamic website content
- **Blog Posts** - Blog content management
- **Webinars** - Educational content
- **Apps** - TQRS applications
- **Social Media Links** - Social media integration
- **Affiliates** - Partner organizations
- **Support Contributions** - Donations and partnerships
- **Contact Submissions** - Contact form data
- **Early Access Signups** - App beta signups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: info@tqrs.org
- Documentation: [Add documentation URL]
- Issues: [Add GitHub issues URL]

## 🔄 Updates and Maintenance

### Regular Maintenance Tasks
- Update dependencies regularly
- Monitor database performance
- Review and rotate JWT secrets
- Backup database regularly
- Monitor error logs

### Adding New Features
1. Create database migrations if needed
2. Add API endpoints in server/routes/
3. Update frontend components
4. Add admin interface if required
5. Update documentation

---

**Built with ❤️ for The Quality Research Series** 

---

## 1. **Backend Changes**

### **A. Update Database Schema**
Add new columns to the `apps` table:
```sql
ALTER TABLE apps ADD COLUMN target_audience VARCHAR(255);
ALTER TABLE apps ADD COLUMN release_date DATE;
```

### **B. Update Backend API (`server/routes/apps.js`)**
- Update the POST and PUT endpoints to accept and store `target_audience` and `release_date`.
- Update the GET endpoints to return these fields.

**Example (snippet for POST/PUT):**
```js
const { name, description, features, status, signup_url, demo_url, target_audience, release_date } = req.body;
// ...existing code...
await pool.execute(
  'INSERT INTO apps (name, description, features, status, signup_url, demo_url, target_audience, release_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  [name, description, features ? JSON.stringify(features) : null, status || 'development', signup_url || null, demo_url || null, target_audience || null, release_date || null]
);
// ...and similar for UPDATE
```

---

## 2. **Frontend (Admin Portal) Changes**

### **A. Update AppManager Form**
- Add new input fields for “Target Audience” and “Release Date”.
- Update the form state and submission logic to include these fields.

**Example (React JSX):**
```jsx
<input
  type="text"
  className="input-field"
  placeholder="Target Audience"
  value={form.target_audience}
  onChange={e => setForm({ ...form, target_audience: e.target.value })}
/>
<input
  type="date"
  className="input-field"
  placeholder="Release Date"
  value={form.release_date}
  onChange={e => setForm({ ...form, release_date: e.target.value })}
/>
```
- Update the API call to include these fields in the request body.

### **B. Display in App List**
- Show the new fields in the app details table or card.

---

## 3. **Automation: Email All Early Access Users**

### **A. Backend Endpoint**
Add a new endpoint in `server/routes/apps.js`:
```js
router.post('/:id/notify-early-access', authenticateToken, async (req, res) => {
  // Fetch all early access signups for this app
  // Use nodemailer to send an email to each
  // Return success/failure
});
```

### **B. Admin Portal Button**
- In the AppManager, add a button: “Notify Early Access Users”
- On click, call the new backend endpoint.
- Show a toast or alert on success/failure.

**Example:**
```jsx
<button
  className="btn-primary"
  onClick={() => notifyEarlyAccess(app.id)}
>
  Notify Early Access Users
</button>
```
```js
async function notifyEarlyAccess(appId) {
  await axios.post(`/api/apps/${appId}/notify-early-access`);
  toast.success('Notification sent to all early access users!');
}
```

---

## 4. **UI Improvements**
- Add tooltips for new fields.
- Use badges for app status.
- Add loading spinners and success/error toasts for all actions.

---

## 5. **Next Steps**

Would you like me to:
- Generate the actual code for these backend and frontend changes?
- Focus on just one part (e.g., only the admin UI, or only the backend)?
- Or help with another workflow or automation?

**Let me know your preference and I’ll implement the next step!** 

---

## 1. **Sample Admin Workflow: Adding a New Qualitative Research App**

### **Step-by-Step (from the Admin Portal):**

1. **Login to the Admin Portal**
   - Go to `http://localhost:3001`
   - Enter your admin credentials.

2. **Navigate to the “Apps” Management Section**
   - In the sidebar or dashboard, click on “Apps” or “AppManager”.

3. **Add a New App**
   - Click the “Add New App” button.
   - Fill in the fields:
     - **App Name** (e.g., “QualiData Pro”)
     - **Description** (e.g., “A tool for robust qualitative data collection and analysis.”)
     - **Features** (e.g., “Data import, coding, visualization, collaboration”)
     - **Status** (choose: development, beta, released)
     - **Signup URL** (for early access signups, if available)
     - **Demo URL** (if a live demo is available)
   - Optionally upload a logo or image if the UI supports it.

4. **Save/Publish**
   - Click “Save” or “Publish”.
   - The new app will now appear on the public Apps page, and users can sign up for early access if you provided a signup URL.

5. **Edit or Update Later**
   - You can always return to the Apps section, select an app, and update its information, features, or status (e.g., move from “beta” to “released”).

6. **Manage Early Access Signups**
   - View and export the list of users who signed up for early access.
   - Optionally, send them notifications when the app is released (can be automated).

---

## 2. **How to Add Custom Fields, Improve UI, or Automate Workflows in the Admin Portal**

### **A. Add Custom Fields to the App Manager**

Suppose you want to add a “Target Audience” and “Release Date” field for each app:

#### **Backend**
- Update the `apps` table in your MySQL schema to include new columns:
  ```sql
  ALTER TABLE apps ADD COLUMN target_audience VARCHAR(255);
  ALTER TABLE apps ADD COLUMN release_date DATE;
  ```
- Update the backend API (`server/routes/apps.js`) to handle these new fields in create/update endpoints.

#### **Frontend (Admin Portal)**
- In `admin/src/pages/AppManager.jsx` (or similar), add new input fields to the app creation/edit form:
  ```jsx
  <input
    type="text"
    className="input-field"
    placeholder="Target Audience"
    value={form.target_audience}
    onChange={e => setForm({ ...form, target_audience: e.target.value })}
  />
  <input
    type="date"
    className="input-field"
    placeholder="Release Date"
    value={form.release_date}
    onChange={e => setForm({ ...form, release_date: e.target.value })}
  />
  ```
- Update the form submission logic to include these fields in the API request.

- Update the display table/list to show the new fields.

---

### **B. Improve the UI**

- Use components from libraries like [Headless UI](https://headlessui.com/) or [Material UI](https://mui.com/) for better forms, tables, and modals.
- Add tooltips, validation, and inline help for each field.
- Use color coding or badges for app status (development, beta, released).
- Add search, filter, and sort capabilities to the app list.

---

### **C. Automate Workflows**

- **Email Notifications:**  
  When a new app is published or moves to “released”, automatically send an email to all early access signups.  
  - Use a backend service (e.g., Nodemailer) to send emails when the app status changes.
  - Add a button in the admin UI: “Notify Early Access Users”.

- **Scheduled Publishing:**  
  Allow admins to set a release date, and automatically publish the app on that date (using a backend cron job or scheduled task).

- **Export Data:**  
  Add a button to export early access signups or app data as CSV.

---

## 3. **Want to See a Code Example?**

If you want, I can:
- Generate the code for adding a “Target Audience” and “Release Date” field to the app management workflow (backend + frontend).
- Show how to add an “Email All Early Access Users” button.
- Or help with any other specific automation or UI improvement.

**Let me know which enhancement you want to see implemented first, or if you want a full code walkthrough for any of the above!** 