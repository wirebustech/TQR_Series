-- TQRS CMS Database Schema

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS tqrs_cms;
USE tqrs_cms;

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Content sections table
CREATE TABLE IF NOT EXISTS content_sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    meta_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(255),
    author_id INT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Social media links table
CREATE TABLE IF NOT EXISTS social_media_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Webinars/Courses table
CREATE TABLE IF NOT EXISTS webinars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date_time DATETIME,
    duration INT, -- in minutes
    video_url VARCHAR(500),
    registration_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Apps table for TQRS applications
CREATE TABLE IF NOT EXISTS apps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    features JSON,
    status ENUM('development', 'beta', 'released') DEFAULT 'development',
    signup_url VARCHAR(500),
    demo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Early access signups table
CREATE TABLE IF NOT EXISTS early_access_signups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    app_id INT,
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100),
    company VARCHAR(100),
    interests JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);

-- Support contributions table
CREATE TABLE IF NOT EXISTS support_contributions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    message TEXT,
    contribution_type ENUM('donation', 'sponsorship', 'partnership') DEFAULT 'donation',
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact form submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100),
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@tqrs.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert default content sections
INSERT INTO content_sections (section_key, title, content, sort_order) VALUES
('hero', 'Welcome to The Quality Research Series', 'Empowering research excellence through innovative solutions and collaborative partnerships.', 1),
('about', 'About TQRS', 'The Quality Research Series (TQRS) is dedicated to advancing research methodologies and fostering collaboration across academic and industry sectors.', 2),
('services', 'Our Services', 'We provide comprehensive research support, data analysis, and innovative tools to enhance your research capabilities.', 3),
('contact', 'Contact Us', 'Get in touch with our team to learn more about our services and how we can support your research initiatives.', 4);

-- Insert sample social media links
INSERT INTO social_media_links (platform, url, icon, sort_order) VALUES
('LinkedIn', 'https://linkedin.com/company/tqrs', 'linkedin', 1),
('Twitter', 'https://twitter.com/tqrs', 'twitter', 2),
('YouTube', 'https://youtube.com/tqrs', 'youtube', 3),
('Facebook', 'https://facebook.com/tqrs', 'facebook', 4);

-- Insert sample affiliates
INSERT INTO affiliates (name, description, logo_url, website_url, sort_order) VALUES
('Research Institute A', 'Leading research institution specializing in quality methodologies', '/logos/affiliate1.png', 'https://example.com', 1),
('University B', 'Premier university with cutting-edge research facilities', '/logos/affiliate2.png', 'https://example.com', 2);

-- Insert sample apps
INSERT INTO apps (name, description, features, status) VALUES
('ResearchHub', 'Comprehensive research management platform', '["Data Collection", "Analysis Tools", "Collaboration"]', 'development'),
('QualityMetrics', 'Advanced quality assessment and measurement tools', '["Metrics Dashboard", "Reporting", "Analytics"]', 'beta'); 