#!/bin/bash

echo "Starting TransitOps Environment Initialization..."

# 1. Fix the Perl Locale Warnings (Non-interactive)
echo "Generating missing language locales..."
export DEBIAN_FRONTEND=noninteractive
locale-gen en_US.UTF-8
locale-gen en_IN.UTF-8
dpkg-reconfigure -f noninteractive locales

# 2. Boot the PostgreSQL Service
echo "Starting PostgreSQL background service..."
systemctl start postgresql
systemctl enable postgresql

# 3. Configure the Database & Passwords
echo "Creating the transitops database..."
su - postgres -c "psql -c \"ALTER USER postgres WITH PASSWORD 'password';\""
su - postgres -c "psql -c \"CREATE DATABASE transitops;\""

echo "Environment Initialization Complete! You can now run 'npm start'."
