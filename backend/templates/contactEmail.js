/**
 * Email template for admin contact notification
 * @param {Object} contact - Contact form data
 * @returns {string} HTML email template
 */
const contactEmailTemplate = (contact) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .field {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    .field:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: 600;
      color: #667eea;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .value {
      color: #333;
      font-size: 15px;
      word-wrap: break-word;
    }
    .message-box {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #667eea;
      margin-top: 10px;
      white-space: pre-wrap;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #eee;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .timestamp {
      color: #999;
      font-size: 13px;
      margin-top: 10px;
    }
    .reply-button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📬 New Contact Form Submission</h1>
    </div>
    
    <div class="field">
      <div class="label">Name</div>
      <div class="value">${contact.name}</div>
    </div>
    
    <div class="field">
      <div class="label">Email</div>
      <div class="value">
        <a href="mailto:${contact.email}" style="color: #667eea; text-decoration: none;">
          ${contact.email}
        </a>
      </div>
    </div>
    
    <div class="field">
      <div class="label">Subject</div>
      <div class="value">${contact.subject}</div>
    </div>
    
    <div class="field">
      <div class="label">Message</div>
      <div class="message-box">${contact.message}</div>
    </div>
    
    <div class="field">
      <div class="timestamp">
        📅 Received: ${new Date(contact.createdAt || Date.now()).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })}
      </div>
    </div>
    
    <div style="text-align: center;">
      <a href="mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}" class="reply-button">
        Reply to ${contact.name.split(' ')[0]}
      </a>
    </div>
    
    <div class="footer">
      <p>This email was sent from your portfolio contact form.</p>
      <p>You can view all contacts in your admin dashboard.</p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = contactEmailTemplate;
