#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║     🚀 SERVICE MARKETPLACE - CODESPACES QUICK START          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Setup environment
echo "⚙️ Setting up environment..."
if [ ! -f .env.local ]; then
    if [ -n "$CODESPACE_NAME" ]; then
        cat > .env.local << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/marketplace?schema=public"
NEXTAUTH_URL="https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
NEXTAUTH_SECRET="$(openssl rand -hex 32)"
JWT_SECRET="$(openssl rand -hex 32)"
REFRESH_SECRET="$(openssl rand -hex 32)"
APP_NAME="Service Marketplace"
APP_URL="https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
DEFAULT_COUNTRY="SY"
NODE_ENV="development"
EOF
    else
        cat > .env.local << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/marketplace?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-$(openssl rand -hex 16)"
JWT_SECRET="$(openssl rand -hex 32)"
REFRESH_SECRET="$(openssl rand -hex 32)"
APP_NAME="Service Marketplace"
APP_URL="http://localhost:3000"
DEFAULT_COUNTRY="SY"
NODE_ENV="development"
EOF
    fi
    echo "✅ Environment file created"
else
    echo "✅ Environment file already exists"
fi
echo ""

# Setup database
echo "🗄️ Setting up database..."
sleep 5
PGPASSWORD=postgres psql -h localhost -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'marketplace'" | grep -q 1 || PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE DATABASE marketplace;"
echo "✅ Database ready"
echo ""

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated"
echo ""

# Run migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev --name init --skip-generate
echo "✅ Database migrations complete"
echo ""

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ SETUP COMPLETE!                          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

if [ -n "$CODESPACE_NAME" ]; then
    echo "🌐 Your app URL:"
    echo "https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    echo ""
    echo "💡 To open your app:"
    echo "   1. Look for the 'PORTS' tab (next to Terminal)"
    echo "   2. Find port 3000 and click the 🌐 globe icon"
else
    echo "🌐 Your app will be available at:"
    echo "http://localhost:3000"
fi

echo ""
echo "🚀 Starting development server..."
npm run dev
