#!/bin/bash

# Temporary Email Frontend Deployment Script for Cloudflare Pages

set -e

echo "🚀 Starting deployment process..."

# Check if required tools are installed
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18 or later."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo "❌ Node.js version 18 or later is required. Current version: $(node --version)"
        exit 1
    fi
    
    echo "✅ Dependencies check passed"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    npm ci
    echo "✅ Dependencies installed"
}

# Run type checking
type_check() {
    echo "🔍 Running type check..."
    npm run type-check
    echo "✅ Type check passed"
}

# Run linting
lint_code() {
    echo "🧹 Running linter..."
    npm run lint
    echo "✅ Linting passed"
}

# Build the application
build_app() {
    echo "🏗️ Building application..."
    npm run build
    echo "✅ Build completed"
}

# Validate build output
validate_build() {
    echo "🔍 Validating build output..."
    
    if [ ! -d "dist" ]; then
        echo "❌ Build directory 'dist' not found"
        exit 1
    fi
    
    if [ ! -f "dist/index.html" ]; then
        echo "❌ index.html not found in build output"
        exit 1
    fi
    
    # Check if critical files exist
    if [ ! -d "dist/assets" ]; then
        echo "❌ Assets directory not found in build output"
        exit 1
    fi
    
    echo "✅ Build validation passed"
}

# Deploy to Cloudflare Pages (if wrangler is available)
deploy_to_cloudflare() {
    if command -v wrangler &> /dev/null; then
        echo "🌐 Deploying to Cloudflare Pages..."
        wrangler pages deploy dist --project-name=temp-email-frontend
        echo "✅ Deployment completed"
    else
        echo "⚠️ Wrangler CLI not found. Please deploy manually:"
        echo "   1. Go to Cloudflare Pages dashboard"
        echo "   2. Create a new project or select existing one"
        echo "   3. Upload the 'dist' folder contents"
        echo "   4. Configure build settings:"
        echo "      - Build command: npm run build"
        echo "      - Build output directory: dist"
        echo "      - Node.js version: 18"
    fi
}

# Main deployment process
main() {
    echo "🎯 Deploying Temporary Email Frontend"
    echo "======================================"
    
    check_dependencies
    install_dependencies
    type_check
    lint_code
    build_app
    validate_build
    
    # Ask user if they want to deploy
    read -p "🤔 Do you want to deploy to Cloudflare Pages? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_to_cloudflare
    else
        echo "📁 Build completed. Files are ready in 'dist' directory."
        echo "📋 Manual deployment instructions:"
        echo "   1. Upload 'dist' folder contents to your hosting provider"
        echo "   2. Configure your web server to serve index.html for all routes"
        echo "   3. Set up proper headers (see _headers file)"
        echo "   4. Configure redirects (see _redirects file)"
    fi
    
    echo ""
    echo "🎉 Deployment process completed!"
    echo "📖 For more information, see README.md"
}

# Handle script interruption
trap 'echo "❌ Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"
