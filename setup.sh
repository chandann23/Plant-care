#!/bin/bash

# Plant Care App - Quick Setup Script
# This script helps you set up the development environment

echo "🌱 Plant Care App - Setup Script"
echo "================================"
echo ""

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install it first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo "✅ Bun is installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
bun install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and add your configuration:"
    echo "   - DATABASE_URL (required)"
    echo "   - NEXTAUTH_SECRET (run: openssl rand -base64 32)"
    echo "   - Other service credentials as needed"
    echo ""
    read -p "Press Enter after you've configured .env..."
else
    echo "✅ .env file exists"
fi

echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
bun prisma:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated"
echo ""

# Check if database is accessible
echo "🗄️  Checking database connection..."
bun prisma db pull --force 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful"
    echo ""
    
    # Run migrations
    echo "🔄 Running database migrations..."
    bun prisma:migrate
    
    if [ $? -eq 0 ]; then
        echo "✅ Migrations completed"
    else
        echo "⚠️  Migrations failed - you may need to run them manually"
    fi
else
    echo "⚠️  Could not connect to database"
    echo "   Please check your DATABASE_URL in .env"
    echo "   You can run migrations later with: bun prisma:migrate"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Make sure your .env is configured correctly"
echo "   2. Run: bun dev"
echo "   3. Open: http://localhost:3000"
echo ""
echo "📖 Documentation:"
echo "   - README.md - Full documentation"
echo "   - QUICKSTART.md - Quick start guide"
echo "   - DEPLOYMENT_COMPLETE.md - Deployment guide"
echo ""
echo "🚀 Ready to start? Run: bun dev"
echo ""
