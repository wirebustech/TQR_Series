const fs = require('fs');
const path = require('path');

// Base HTML template
const baseTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
        }
        .highlight {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        .feature-item {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 20px;
            }
            .feature-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">TQRS</div>
            <h1 style="margin: 0; color: #333;">{{subject}}</h1>
        </div>
        
        <div class="content">
            {{content}}
        </div>
        
        <div class="footer">
            <p>Best regards,<br>The TQRS Team</p>
            <div class="social-links">
                <a href="https://linkedin.com/company/tqrs">LinkedIn</a> |
                <a href="https://twitter.com/tqrs">Twitter</a> |
                <a href="https://youtube.com/tqrs">YouTube</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px;">
                You're receiving this email because you're part of the TQRS community.<br>
                <a href="{{unsubscribeUrl}}" style="color: #667eea;">Unsubscribe</a> | 
                <a href="{{preferencesUrl}}" style="color: #667eea;">Email Preferences</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

// Email templates
const templates = {
  // Early Access Notification
  earlyAccess: (appName, userName, appDetails) => {
    const content = `
      <p>Hi ${userName || 'there'},</p>
      
      <p>We're excited to let you know that early access is now available for <strong>${appName}</strong>!</p>
      
      <div class="highlight">
        <p><strong>🎉 Early Access Benefits:</strong></p>
        <ul>
          <li>Be among the first to experience our latest qualitative research tools</li>
          <li>Provide valuable feedback to shape the final product</li>
          <li>Access to premium features during the early access period</li>
          <li>Direct communication with our development team</li>
        </ul>
      </div>
      
      ${appDetails ? `
        <div class="feature-grid">
          <div class="feature-item">
            <strong>Target Audience:</strong><br>
            ${appDetails.target_audience || 'Qualitative researchers'}
          </div>
          <div class="feature-item">
            <strong>Status:</strong><br>
            ${appDetails.status || 'Development'}
          </div>
        </div>
      ` : ''}
      
      <p><strong>What's Next?</strong></p>
      <ol>
        <li>Click the button below to access the app</li>
        <li>Explore the features and functionality</li>
        <li>Share your feedback through our feedback system</li>
        <li>Join our community discussions</li>
      </ol>
      
      <div style="text-align: center;">
        <a href="{{appUrl}}" class="button">Access ${appName}</a>
      </div>
      
      <p>If you have any questions or need support, don't hesitate to reach out to our team.</p>
    `;
    
    return {
      subject: `Early Access Available: ${appName}`,
      html: baseTemplate
        .replace('{{subject}}', `Early Access Available: ${appName}`)
        .replace('{{content}}', content)
        .replace('{{unsubscribeUrl}}', '{{unsubscribeUrl}}')
        .replace('{{preferencesUrl}}', '{{preferencesUrl}}')
        .replace('{{appUrl}}', '{{appUrl}}')
    };
  },

  // App Launch Announcement
  appLaunch: (appName, userName, appDetails) => {
    const content = `
      <p>Hi ${userName || 'there'},</p>
      
      <p>Great news! <strong>${appName}</strong> has officially launched and is now available for use! 🚀</p>
      
      <div class="highlight">
        <p><strong>🎊 Launch Celebration:</strong></p>
        <ul>
          <li>Full access to all features and functionality</li>
          <li>Comprehensive documentation and tutorials</li>
          <li>Community support and discussion forums</li>
          <li>Regular updates and improvements</li>
        </ul>
      </div>
      
      ${appDetails ? `
        <div class="feature-grid">
          <div class="feature-item">
            <strong>Key Features:</strong><br>
            ${Array.isArray(appDetails.features) ? appDetails.features.join(', ') : appDetails.features || 'Advanced qualitative research tools'}
          </div>
          <div class="feature-item">
            <strong>Target Audience:</strong><br>
            ${appDetails.target_audience || 'Qualitative researchers'}
          </div>
        </div>
      ` : ''}
      
      <p><strong>Getting Started:</strong></p>
      <ol>
        <li>Visit the app platform</li>
        <li>Create your account or sign in</li>
        <li>Explore the features and tutorials</li>
        <li>Join our community discussions</li>
      </ol>
      
      <div style="text-align: center;">
        <a href="{{appUrl}}" class="button">Launch ${appName}</a>
      </div>
      
      <p>Thank you for your patience and support during the development phase. We're excited to see how you'll use ${appName} in your research!</p>
    `;
    
    return {
      subject: `${appName} is Now Live!`,
      html: baseTemplate
        .replace('{{subject}}', `${appName} is Now Live!`)
        .replace('{{content}}', content)
        .replace('{{unsubscribeUrl}}', '{{unsubscribeUrl}}')
        .replace('{{preferencesUrl}}', '{{preferencesUrl}}')
        .replace('{{appUrl}}', '{{appUrl}}')
    };
  },

  // Webinar Announcement
  webinarAnnouncement: (webinarTitle, userName, webinarDetails) => {
    const content = `
      <p>Hi ${userName || 'there'},</p>
      
      <p>We're excited to announce our upcoming webinar: <strong>${webinarTitle}</strong> 📚</p>
      
      <div class="highlight">
        <p><strong>📅 Webinar Details:</strong></p>
        <ul>
          <li><strong>Date:</strong> ${webinarDetails.date_time ? new Date(webinarDetails.date_time).toLocaleDateString() : 'TBD'}</li>
          <li><strong>Duration:</strong> ${webinarDetails.duration ? `${webinarDetails.duration} minutes` : 'TBD'}</li>
          <li><strong>Format:</strong> Live presentation + Q&A session</li>
          <li><strong>Cost:</strong> Free for all participants</li>
        </ul>
      </div>
      
      <p><strong>What You'll Learn:</strong></p>
      <p>${webinarDetails.description || 'Join us for an informative session on qualitative research methodologies and best practices.'}</p>
      
      <p><strong>Why Attend?</strong></p>
      <ul>
        <li>Learn from expert researchers and practitioners</li>
        <li>Get practical tips and insights</li>
        <li>Network with fellow researchers</li>
        <li>Ask questions and get personalized answers</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="{{registrationUrl}}" class="button">Register Now</a>
      </div>
      
      <p>Don't miss this opportunity to enhance your qualitative research skills!</p>
    `;
    
    return {
      subject: `New Webinar: ${webinarTitle}`,
      html: baseTemplate
        .replace('{{subject}}', `New Webinar: ${webinarTitle}`)
        .replace('{{content}}', content)
        .replace('{{unsubscribeUrl}}', '{{unsubscribeUrl}}')
        .replace('{{preferencesUrl}}', '{{preferencesUrl}}')
        .replace('{{registrationUrl}}', '{{registrationUrl}}')
    };
  },

  // Newsletter
  newsletter: (title, content, userName) => {
    const newsletterContent = `
      <p>Hi ${userName || 'there'},</p>
      
      <p>Here's your latest update from The Qualitative Research Series (TQRS):</p>
      
      <h2 style="color: #667eea; margin: 30px 0 20px 0;">${title}</h2>
      
      <div class="content">
        ${content}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{websiteUrl}}" class="button">Visit TQRS Website</a>
      </div>
      
      <p>Stay connected with us for more updates, resources, and opportunities!</p>
    `;
    
    return {
      subject: `TQRS Newsletter: ${title}`,
      html: baseTemplate
        .replace('{{subject}}', `TQRS Newsletter: ${title}`)
        .replace('{{content}}', newsletterContent)
        .replace('{{unsubscribeUrl}}', '{{unsubscribeUrl}}')
        .replace('{{preferencesUrl}}', '{{preferencesUrl}}')
        .replace('{{websiteUrl}}', '{{websiteUrl}}')
    };
  },

  // Welcome Email
  welcome: (userName) => {
    const content = `
      <p>Hi ${userName || 'there'},</p>
      
      <p>Welcome to The Qualitative Research Series (TQRS)! 🎉</p>
      
      <p>We're thrilled to have you join our community of researchers, practitioners, and enthusiasts dedicated to advancing qualitative research methodologies.</p>
      
      <div class="highlight">
        <p><strong>What's Next?</strong></p>
        <ul>
          <li>Explore our latest blog posts and resources</li>
          <li>Register for upcoming webinars and workshops</li>
          <li>Check out our qualitative research apps</li>
          <li>Connect with fellow researchers in our community</li>
        </ul>
      </div>
      
      <div class="feature-grid">
        <div class="feature-item">
          <strong>📚 Learning Resources</strong><br>
          Access our comprehensive library of qualitative research materials
        </div>
        <div class="feature-item">
          <strong>🛠️ Research Tools</strong><br>
          Try our innovative apps designed for qualitative researchers
        </div>
        <div class="feature-item">
          <strong>🌍 Global Community</strong><br>
          Connect with researchers from around the world
        </div>
        <div class="feature-item">
          <strong>🎓 Expert Support</strong><br>
          Get guidance from experienced qualitative research practitioners
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="{{websiteUrl}}" class="button">Get Started</a>
      </div>
      
      <p>If you have any questions or need assistance, don't hesitate to reach out to our team.</p>
    `;
    
    return {
      subject: 'Welcome to TQRS!',
      html: baseTemplate
        .replace('{{subject}}', 'Welcome to TQRS!')
        .replace('{{content}}', content)
        .replace('{{unsubscribeUrl}}', '{{unsubscribeUrl}}')
        .replace('{{preferencesUrl}}', '{{preferencesUrl}}')
        .replace('{{websiteUrl}}', '{{websiteUrl}}')
    };
  },

  // Custom Template
  custom: (subject, content, userName) => {
    const customContent = `
      <p>Hi ${userName || 'there'},</p>
      
      ${content}
    `;
    
    return {
      subject: subject,
      html: baseTemplate
        .replace('{{subject}}', subject)
        .replace('{{content}}', customContent)
        .replace('{{unsubscribeUrl}}', '{{unsubscribeUrl}}')
        .replace('{{preferencesUrl}}', '{{preferencesUrl}}')
    };
  }
};

// Helper function to replace placeholders
const replacePlaceholders = (template, data) => {
  let result = template;
  
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), value || '');
  });
  
  return result;
};

// Generate email with template
const generateEmail = (templateName, data) => {
  const template = templates[templateName];
  
  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }
  
  const emailData = {
    ...data,
    unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(data.email)}`,
    preferencesUrl: `${process.env.FRONTEND_URL}/email-preferences`,
    websiteUrl: process.env.FRONTEND_URL || 'https://tqrs.org'
  };
  
  return {
    subject: replacePlaceholders(template.subject, emailData),
    html: replacePlaceholders(template.html, emailData),
    text: replacePlaceholders(template.text || template.subject, emailData)
  };
};

module.exports = {
  templates,
  generateEmail,
  replacePlaceholders
}; 