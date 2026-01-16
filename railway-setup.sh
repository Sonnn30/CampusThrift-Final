#!/bin/bash
# Railway Setup Script

echo " Setting up Railway deployment..."

# Create storage link
echo " Creating storage link..."
php artisan storage:link

# Clear all caches
echo " Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run migrations
echo " Running migrations..."
php artisan migrate --force

echo " Railway setup complete!"
