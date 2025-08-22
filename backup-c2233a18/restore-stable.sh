#!/bin/bash

echo "🚀 RESTORING STABLE VERSION c2233a18"
echo "====================================="

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  WARNING: You have uncommitted changes!"
    echo "Current changes:"
    git status --short
    echo ""
    read -p "Do you want to stash these changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git stash push -m "Auto-stashed before restoring stable version"
        echo "✅ Changes stashed successfully"
    else
        echo "❌ Aborting restore. Please commit or stash your changes first."
        exit 1
    fi
fi

# Fetch latest from remote
echo "📥 Fetching latest from remote..."
git fetch origin

# Checkout the stable backup branch
echo "🔄 Switching to stable backup branch..."
git checkout backup-c2233a18-stable

echo ""
echo "✅ SUCCESS! You are now at the stable version c2233a18"
echo "📍 Current branch: backup-c2233a18-stable"
echo "📍 Current commit: $(git rev-parse --short HEAD)"
echo ""
echo "To return to main: git checkout main"
echo "To create a new branch from here: git checkout -b new-feature"
echo ""
echo "🎯 All your good functionality is preserved and ready to use!"