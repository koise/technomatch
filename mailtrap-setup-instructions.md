# Setting Up Mailtrap as an Alternative Email Service

When Gmail's sending limits are reached, Mailtrap provides a great alternative for testing email functionality.

## What is Mailtrap?
Mailtrap is a test mail server solution that allows testing email notifications without sending them to real users. It's perfect for development and testing environments.

## Setup Instructions

### 1. Create a Mailtrap Account
1. Go to [Mailtrap.io](https://mailtrap.io/) and sign up for a free account
2. After signing up, navigate to the **Email Testing** section
3. You'll see an **Inboxes** section - click on the default inbox or create a new one

### 2. Get Your SMTP Credentials
1. In your inbox, select the **SMTP Settings** tab
2. Find the **Integrations** dropdown and select **Laravel 9+**
3. You'll see SMTP credentials formatted for Laravel's .env file

### 3. Update Your .env File
Replace your current mail settings with:

```
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=from@example.com
MAIL_FROM_NAME="TechnoMatch"
```

Replace:
- `your_mailtrap_username` and `your_mailtrap_password` with the credentials from Mailtrap
- `from@example.com` with your desired from address (it doesn't need to be real for Mailtrap)

### 4. Clear Cache and Test
Run these commands:
```bash
php artisan config:clear
php artisan cache:clear
```

### 5. Test Your Email Sending
Use the verification feature again. All emails will be captured in your Mailtrap inbox instead of being sent to real recipients.

## Benefits of Using Mailtrap
- No sending limits to worry about
- No risk of accidentally sending test emails to real users
- Ability to test email layout, spam score, and HTML validity
- Can verify all emails are properly formatted without cluttering inboxes

## Notes
- Mailtrap is intended for testing, not production use
- For production, consider services like:
  - Mailgun
  - SendGrid
  - Amazon SES
  - Postmark

## Production Email Service Recommendations
When moving to production, consider these email service providers:

| Service | Free Tier | Pros |
|---------|-----------|------|
| Mailgun | 10,000 emails/month for 3 months | Great deliverability, easy API |
| SendGrid | 100 emails/day forever | Excellent analytics, good for marketing emails |
| Amazon SES | 62,000 emails/month when sending from EC2 | Very low cost ($0.10 per 1,000), high deliverability |
| Postmark | No free tier (but $75 starting credit) | Best deliverability, focused on transactional email |

Each has its own Laravel integration documentation available on their websites. 