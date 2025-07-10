#!/bin/bash

# Cloudflare Pages Build Script
set -e

echo "🔧 Installing dependencies..."
npm ci --include=optional

echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
