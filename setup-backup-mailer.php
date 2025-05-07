<?php
/**
 * Backup Mailer Setup Script
 * 
 * This script helps set up backup mailers in the .env file
 * to handle cases where Gmail sending limits are reached.
 * 
 * Run this script using: php setup-backup-mailer.php
 */

// Intro
echo PHP_EOL;
echo "=======================================================" . PHP_EOL;
echo "         TechnoMatch Backup Mailer Setup Tool          " . PHP_EOL;
echo "=======================================================" . PHP_EOL;
echo PHP_EOL;
echo "This script will help you set up backup mailers for when" . PHP_EOL;
echo "Gmail sending limits are reached." . PHP_EOL;
echo PHP_EOL;

// Check if .env file exists
if (!file_exists('.env')) {
    echo "Error: .env file not found in current directory." . PHP_EOL;
    echo "Please run this script from your Laravel project root." . PHP_EOL;
    exit(1);
}

// Read current .env file
$envContent = file_get_contents('.env');

// Create backup of .env file
$backupFile = '.env.backup-' . date('YmdHis');
file_put_contents($backupFile, $envContent);
echo "Created backup of .env file at: $backupFile" . PHP_EOL . PHP_EOL;

// Menu
echo "Please select which backup mailer you'd like to configure:" . PHP_EOL;
echo "1) Mailtrap (recommended for testing/development)" . PHP_EOL;
echo "2) SendGrid" . PHP_EOL;
echo "3) Mailgun" . PHP_EOL;
echo "q) Quit without changes" . PHP_EOL;
echo PHP_EOL;

$choice = readline("Enter your choice (1-3, or q): ");

switch ($choice) {
    case '1': // Mailtrap
        echo PHP_EOL . "Setting up Mailtrap as backup mailer..." . PHP_EOL;
        
        echo "You'll need your Mailtrap username and password." . PHP_EOL;
        echo "You can find these at mailtrap.io > Email Testing > Your Inbox > SMTP Settings." . PHP_EOL . PHP_EOL;
        
        $username = readline("Enter your Mailtrap username: ");
        $password = readline("Enter your Mailtrap password: ");
        
        if (empty($username) || empty($password)) {
            echo "Error: Username and password are required." . PHP_EOL;
            exit(1);
        }
        
        // Add Mailtrap config to .env
        $mailtrapConfig = PHP_EOL . "# Backup mailer configuration (Mailtrap)" . PHP_EOL;
        $mailtrapConfig .= "MAILTRAP_USERNAME=\"$username\"" . PHP_EOL;
        $mailtrapConfig .= "MAILTRAP_PASSWORD=\"$password\"" . PHP_EOL;
        
        file_put_contents('.env', $envContent . $mailtrapConfig);
        
        echo PHP_EOL . "✅ Mailtrap configured successfully as a backup mailer!" . PHP_EOL;
        break;
        
    case '2': // SendGrid
        echo PHP_EOL . "Setting up SendGrid as backup mailer..." . PHP_EOL;
        
        echo "You'll need your SendGrid API key." . PHP_EOL;
        echo "You can create one at app.sendgrid.com > Settings > API Keys." . PHP_EOL . PHP_EOL;
        
        $apiKey = readline("Enter your SendGrid API key: ");
        
        if (empty($apiKey)) {
            echo "Error: API key is required." . PHP_EOL;
            exit(1);
        }
        
        // Add SendGrid config to .env
        $sendgridConfig = PHP_EOL . "# Backup mailer configuration (SendGrid)" . PHP_EOL;
        $sendgridConfig .= "SENDGRID_API_KEY=\"$apiKey\"" . PHP_EOL;
        
        file_put_contents('.env', $envContent . $sendgridConfig);
        
        echo PHP_EOL . "✅ SendGrid configured successfully as a backup mailer!" . PHP_EOL;
        break;
        
    case '3': // Mailgun
        echo PHP_EOL . "Setting up Mailgun as backup mailer..." . PHP_EOL;
        
        echo "You'll need your Mailgun domain and API key." . PHP_EOL;
        echo "You can find these at app.mailgun.com > Sending > Domains > [your domain]." . PHP_EOL . PHP_EOL;
        
        $domain = readline("Enter your Mailgun domain: ");
        $apiKey = readline("Enter your Mailgun API key: ");
        
        if (empty($domain) || empty($apiKey)) {
            echo "Error: Domain and API key are required." . PHP_EOL;
            exit(1);
        }
        
        // Add Mailgun config to .env
        $mailgunConfig = PHP_EOL . "# Backup mailer configuration (Mailgun)" . PHP_EOL;
        $mailgunConfig .= "MAILGUN_DOMAIN=\"$domain\"" . PHP_EOL;
        $mailgunConfig .= "MAILGUN_SECRET=\"$apiKey\"" . PHP_EOL;
        
        file_put_contents('.env', $envContent . $mailgunConfig);
        
        echo PHP_EOL . "✅ Mailgun configured successfully as a backup mailer!" . PHP_EOL;
        break;
        
    case 'q':
    case 'Q':
        echo PHP_EOL . "Exiting without changes." . PHP_EOL;
        exit(0);
        
    default:
        echo PHP_EOL . "Invalid choice. Exiting without changes." . PHP_EOL;
        exit(1);
}

echo PHP_EOL . "Don't forget to clear your configuration cache:" . PHP_EOL;
echo "php artisan config:clear" . PHP_EOL;
echo PHP_EOL . "Your email system will now automatically switch to the backup mailer" . PHP_EOL;
echo "when Gmail sending limits are reached." . PHP_EOL;
echo PHP_EOL . "To test your email configuration, visit: /mail-diagnostic/test" . PHP_EOL;
echo "=======================================================" . PHP_EOL; 