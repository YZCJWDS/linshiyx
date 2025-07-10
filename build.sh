#!/bin/bash

# Cloudflare Pages Build Script
set -e

echo "🔧 Setting up build environment..."

# Remove existing node_modules and package-lock.json to ensure clean install
echo "📦 Cleaning up existing dependencies..."
rm -rf node_modules package-lock.json

# Install dependencies with specific flags for Cloudflare Pages
echo "📦 Installing dependencies..."
npm install --include=optional --no-package-lock

# Force install rollup platform-specific package
echo "🔧 Installing platform-specific rollup package..."
npm install @rollup/rollup-linux-x64-gnu --save-dev --no-package-lock

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"
