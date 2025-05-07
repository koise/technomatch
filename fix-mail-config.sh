#!/bin/bash

# Script to fix mail configuration in Laravel project
# This script will fix common issues with Laravel mail configuration
# Run this script from the root of your Laravel project

# Set text colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting mail configuration fix script...${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}ERROR: .env file not found in the current directory.${NC}"
    echo "Please run this script from the root of your Laravel project."
    exit 1
fi

echo -e "${YELLOW}Creating backup of current .env file...${NC}"
cp .env .env.backup.$(date +%Y%m%d%H%M%S)
echo -e "${GREEN}Backup created successfully.${NC}"

# Create a temporary file
tmp_file=$(mktemp)

# Extract only the unique environment variables from the .env file
# This removes duplicates keeping only the last occurrence of each variable
awk -F= '!seen[$1]++' .env > $tmp_file

# Now we need to ensure the mail configuration is correct
# Extract existing mail configuration
echo -e "${YELLOW}Updating mail configuration...${NC}"

# Read current mail configuration from the temp file
mail_mailer=$(grep -E "^MAIL_MAILER=" $tmp_file | cut -d "=" -f2)
mail_host=$(grep -E "^MAIL_HOST=" $tmp_file | cut -d "=" -f2)
mail_port=$(grep -E "^MAIL_PORT=" $tmp_file | cut -d "=" -f2)
mail_username=$(grep -E "^MAIL_USERNAME=" $tmp_file | cut -d "=" -f2)
mail_password=$(grep -E "^MAIL_PASSWORD=" $tmp_file | cut -d "=" -f2)
mail_encryption=$(grep -E "^MAIL_ENCRYPTION=" $tmp_file | cut -d "=" -f2)
mail_from_address=$(grep -E "^MAIL_FROM_ADDRESS=" $tmp_file | cut -d "=" -f2)
mail_from_name=$(grep -E "^MAIL_FROM_NAME=" $tmp_file | cut -d "=" -f2)

# Display current configuration
echo -e "${YELLOW}Current mail configuration:${NC}"
echo "MAIL_MAILER=$mail_mailer"
echo "MAIL_HOST=$mail_host"
echo "MAIL_PORT=$mail_port"
echo "MAIL_USERNAME=$mail_username"
echo "MAIL_PASSWORD=****" # Don't show password
echo "MAIL_ENCRYPTION=$mail_encryption"
echo "MAIL_FROM_ADDRESS=$mail_from_address"
echo "MAIL_FROM_NAME=$mail_from_name"

echo -e "${YELLOW}Do you want to use Gmail SMTP for sending emails? (y/n)${NC}"
read use_gmail

if [ "$use_gmail" = "y" ] || [ "$use_gmail" = "Y" ]; then
    # Set Gmail defaults
    mail_mailer="smtp"
    mail_host="smtp.gmail.com"
    mail_port="587"
    mail_encryption="tls"
    
    echo -e "${YELLOW}Please enter your Gmail address:${NC}"
    read gmail_address
    
    echo -e "${YELLOW}Please enter your Gmail app password:${NC}"
    read -s gmail_password
    echo ""
    
    mail_username="$gmail_address"
    mail_password="$gmail_password"
    mail_from_address="$gmail_address"
    
    echo -e "${YELLOW}Please enter the 'From' name to use for sent emails:${NC}"
    read from_name
    mail_from_name="$from_name"
fi

# Remove all mail configuration variables from the temp file
grep -v -E "^MAIL_MAILER=|^MAIL_HOST=|^MAIL_PORT=|^MAIL_USERNAME=|^MAIL_PASSWORD=|^MAIL_ENCRYPTION=|^MAIL_FROM_ADDRESS=|^MAIL_FROM_NAME=" $tmp_file > $tmp_file.new
mv $tmp_file.new $tmp_file

# Add the updated mail configuration at the end of the temp file
echo "" >> $tmp_file
echo "# Mail configuration" >> $tmp_file
echo "MAIL_MAILER=$mail_mailer" >> $tmp_file
echo "MAIL_HOST=$mail_host" >> $tmp_file
echo "MAIL_PORT=$mail_port" >> $tmp_file
echo "MAIL_USERNAME=$mail_username" >> $tmp_file
echo "MAIL_PASSWORD=\"$mail_password\"" >> $tmp_file
echo "MAIL_ENCRYPTION=$mail_encryption" >> $tmp_file
echo "MAIL_FROM_ADDRESS=\"$mail_from_address\"" >> $tmp_file
echo "MAIL_FROM_NAME=\"$mail_from_name\"" >> $tmp_file

# Replace the .env file with the fixed version
mv $tmp_file .env

echo -e "${GREEN}Mail configuration updated successfully!${NC}"
echo -e "${YELLOW}Running PHP artisan config:clear to refresh configuration...${NC}"

php artisan config:clear

echo -e "${GREEN}Configuration cache cleared.${NC}"
echo -e "${YELLOW}To test your mail configuration, visit:/mail-diagnostic/test${NC}"
echo -e "${GREEN}Done!${NC}" 