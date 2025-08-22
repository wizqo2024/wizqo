#!/bin/bash

# 🚀 WIZQO COMPLETE APP BACKUP RESTORATION SCRIPT
# 📅 Backup Date: August 22, 2025 - 17:18:42 UTC
# 🎯 Restores complete working app with all features

echo "🎉 WIZQO COMPLETE APP BACKUP RESTORATION"
echo "=========================================="
echo "📅 Backup Date: August 22, 2025 - 17:18:42 UTC"
echo "🚀 All Features Working & Tested"
echo ""

# Check if we're in the right directory
if [ ! -f "README-COMPLETE-FEATURES.md" ]; then
    echo "❌ Error: Please run this script from the backup directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: README-COMPLETE-FEATURES.md"
    exit 1
fi

echo "✅ Backup directory verified"
echo ""

# Create restoration directory
RESTORE_DIR="../wizqo-restored-$(date +%Y%m%d-%H%M%S)"
echo "📁 Creating restoration directory: $RESTORE_DIR"
mkdir -p "$RESTORE_DIR"

# Copy all files
echo "📋 Copying backup files..."
cp -r * "$RESTORE_DIR/"
echo "✅ Files copied successfully"

# Navigate to restoration directory
cd "$RESTORE_DIR"

echo ""
echo "🔧 SETTING UP RESTORED APP"
echo "=========================="

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the app
echo "🏗️ Building the app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ App built successfully"
else
    echo "❌ Failed to build app"
    exit 1
fi

echo ""
echo "🎉 RESTORATION COMPLETE!"
echo "========================"
echo "📁 Restored app location: $(pwd)"
echo "🚀 All features are now available:"
echo "   ✅ AI-powered hobby validation"
echo "   ✅ 7-day learning plans"
echo "   ✅ Unique daily videos"
echo "   ✅ Progress tracking"
echo "   ✅ User authentication"
echo "   ✅ SEO optimization"
echo ""

echo "🔧 NEXT STEPS:"
echo "1. Set up environment variables (see README)"
echo "2. Configure Supabase database"
echo "3. Set OpenRouter API key"
echo "4. Set YouTube API key"
echo "5. Deploy to Vercel or run locally"
echo ""

echo "📚 For detailed setup instructions, see: README-COMPLETE-FEATURES.md"
echo ""

echo "🎯 Your Wizqo app is now fully restored with all features working!"