const nodemailer = require('nodemailer');

// Create transporter instance
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email with error handling
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      ...(html && { html }),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails with progress tracking
const sendBulkEmails = async (recipients, subject, message, personalizationField = 'name') => {
  const transporter = createTransporter();
  const results = {
    sent: 0,
    failed: 0,
    errors: [],
  };

  for (const recipient of recipients) {
    try {
      const personalizedMessage = message.replace(
        new RegExp(`{{${personalizationField}}}`, 'g'),
        recipient[personalizationField] || 'there'
      );

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient.email,
        subject,
        text: personalizedMessage,
      };

      await transporter.sendMail(mailOptions);
      results.sent++;
      console.log(`Email sent to ${recipient.email}`);
    } catch (error) {
      results.failed++;
      results.errors.push({ email: recipient.email, error: error.message });
      console.error(`Failed to send email to ${recipient.email}:`, error);
    }
  }

  return results;
};

// Email templates
const templates = {
  earlyAccessNotification: (appName, userName) => ({
    subject: `Early Access Available: ${appName}`,
    text: `Hi ${userName || 'there'},

We're excited to let you know that early access is now available for ${appName}!

As an early access user, you'll be among the first to experience our latest qualitative research tools and features.

Please visit our platform to get started.

Best regards,
The TQRS Team`,
  }),

  appLaunch: (appName, userName) => ({
    subject: `${appName} is Now Live!`,
    text: `Hi ${userName || 'there'},

Great news! ${appName} has officially launched and is now available for use.

You can access it at our platform and start exploring all the features.

Thank you for your patience and support during the development phase.

Best regards,
The TQRS Team`,
  }),
};

module.exports = {
  sendEmail,
  sendBulkEmails,
  templates,
  createTransporter,
}; 