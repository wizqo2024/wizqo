#!/bin/bash

# 🛡️ WORKING PLAN DATA BACKUP RESTORE SCRIPT
# Created: August 22, 2025
# Purpose: Restore working plan data functionality

echo "🛡️ WORKING PLAN DATA BACKUP RESTORE"
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -f "BACKUP_README.md" ]; then
    echo "❌ Error: This script must be run from the backup directory"
    echo "Current directory: $(pwd)"
    echo "Expected: backup-working-plan-data-20250822-160410"
    exit 1
fi

echo "✅ Backup directory confirmed"
echo "📁 Backup location: $(pwd)"
echo ""

# Ask for confirmation
read -p "🚨 This will restore the working backup to your main workspace. Continue? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled"
    exit 1
fi

echo ""
echo "🔄 Starting backup restore..."

# Get the workspace directory (parent of backup)
WORKSPACE_DIR="$(dirname "$(pwd)")"
echo "📁 Target workspace: $WORKSPACE_DIR"

# Check if workspace exists
if [ ! -d "$WORKUP_DIR" ]; then
    echo "❌ Error: Workspace directory not found: $WORKSPACE_DIR"
    exit 1
fi

echo ""
echo "📋 Files to restore:"
echo "  - client/ (Frontend React app)"
echo "  - server/ (Backend API)"
echo "  - package*.json (Dependencies)"
echo "  - vercel.json (Vercel config)"

# Create backup of current state (if it exists)
if [ -d "$WORKSPACE_DIR/client" ]; then
    echo ""
    echo "🔄 Creating backup of current state..."
    CURRENT_BACKUP="$WORKSPACE_DIR/backup-current-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$CURRENT_BACKUP"
    cp -r "$WORKSPACE_DIR/client" "$CURRENT_BACKUP/"
    cp -r "$WORKSPACE_DIR/server" "$CURRENT_BACKUP/" 2>/dev/null || true
    cp "$WORKSPACE_DIR/package*.json" "$CURRENT_BACKUP/" 2>/dev/null || true
    cp "$WORKSPACE_DIR/vercel.json" "$CURRENT_BACKUP/" 2>/dev/null || true
    echo "✅ Current state backed up to: $CURRENT_BACKUP"
fi

echo ""
echo "🔄 Restoring files..."

# Restore client directory
if [ -d "client" ]; then
    echo "  📱 Restoring client/..."
    rm -rf "$WORKSPACE_DIR/client"
    cp -r "client" "$WORKSPACE_DIR/"
    echo "  ✅ client/ restored"
else
    echo "  ❌ client/ not found in backup"
fi

# Restore server directory
if [ -d "server" ]; then
    echo "  🔧 Restoring server/..."
    rm -rf "$WORKSPACE_DIR/server"
    cp -r "server" "$WORKSPACE_DIR/"
    echo "  ✅ server/ restored"
else
    echo "  ❌ server/ not found in backup"
fi

# Restore package files
if [ -f "package.json" ]; then
    echo "  📦 Restoring package.json..."
    cp "package.json" "$WORKSPACE_DIR/"
    echo "  ✅ package.json restored"
fi

if [ -f "package-lock.json" ]; then
    echo "  📦 Restoring package-lock.json..."
    cp "package-lock.json" "$WORKSPACE_DIR/"
    echo "  ✅ package-lock.json restored"
fi

# Restore vercel config
if [ -f "vercel.json" ]; then
    echo "  🚀 Restoring vercel.json..."
    cp "vercel.json" "$WORKSPACE_DIR/"
    echo "  ✅ vercel.json restored"
fi

echo ""
echo "✅ Backup restore completed!"
echo ""

# Instructions for next steps
echo "🚀 Next steps:"
echo "1. Navigate to workspace: cd $WORKSPACE_DIR"
echo "2. Install dependencies: npm install"
echo "3. Build the app: npm run build"
echo "4. Test functionality"
echo "5. Commit changes: git add . && git commit -m 'Restore working backup'"
echo "6. Push to main: git push origin main"
echo ""

echo "🛡️ Your working plan data functionality has been restored!"
echo "📁 Backup location: $(pwd)"
echo "📁 Current state backup: $CURRENT_BACKUP"
echo ""
echo "🎯 Test the application to ensure:"
echo "  - Plan data loads correctly from database"
echo "  - Saved days are preserved when navigating"
echo "  - Progress tracking works"
echo "  - Dashboard → Plan page navigation works"