#!/bin/bash

echo "🚀 Setting up Enterprise React AI Channel Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
node_version=$(node -v | sed 's/v//')
required_version="18.0.0"

if ! node -e "process.exit(require('semver').gte('$node_version', '$required_version'))" 2>/dev/null; then
    echo "❌ Node.js version $node_version is too old. Please install Node.js 18+ ."
    exit 1
fi

echo "✅ Node.js version $node_version detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "✅ Environment file created. Please update .env with your configuration."
else
    echo "✅ Environment file already exists"
fi

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p src/components/ui
mkdir -p src/utils
mkdir -p src/assets/images
mkdir -p src/assets/icons

echo "✅ Project directories created"

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Update your .env file with the correct configuration:"
echo "   - VITE_LIVEKIT_URL: Your LiveKit server URL"
echo "   - VITE_API_BASE_URL: Your backend API URL"
echo "   - VITE_WEBSOCKET_URL: Your WebSocket server URL"
echo "   - VITE_AI_AGENT_API_KEY: Your AI agent API key"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open your browser to http://localhost:3000"
echo ""
echo "For more information, see the README.md file."
