#!/bin/bash

# Cloudflare Pages Build Script
set -e

echo "🔧 Setting up Node.js environment..."
export NODE_VERSION=18
export NPM_CONFIG_INCLUDE=optional

echo "📦 Installing dependencies with optional packages..."
rm -rf node_modules package-lock.json
npm install --include=optional

echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Output directory: dist"
