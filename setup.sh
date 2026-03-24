#!/bin/bash
# Tickle App - GitHub & Vercel Setup Script
# Run this from inside ~/Documents/tickle-app

set -e

echo "🤣 Tickle App Setup"
echo "===================="
echo ""

# Check for required tools
if ! command -v git &> /dev/null; then
  echo "❌ git not found. Install Xcode Command Line Tools: xcode-select --install"
  exit 1
fi

if ! command -v gh &> /dev/null; then
  echo "📦 Installing GitHub CLI..."
  if command -v brew &> /dev/null; then
    brew install gh
  else
    echo "❌ Homebrew not found. Install gh CLI from: https://cli.github.com"
    echo "   Or install Homebrew first: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
  fi
fi

# Set up git
echo "📁 Initializing git repository..."
git init
git config user.email "jason.kuziel@gmail.com"
git config user.name "Jason Kuziel"
git branch -M main
git add .
git commit -m "Initial commit: Tickle app - Facebook Poke-style social tickling app"
echo "✅ Git initialized with initial commit"

# Authenticate with GitHub
echo ""
echo "🔐 Authenticating with GitHub..."
echo "   A browser window will open. Approve the login there."
gh auth login --web --git-protocol https

# Create GitHub repo
echo ""
echo "📦 Creating GitHub repository..."
gh repo create tickle-app --public --description "A social app for tickling your friends 🤣" --push --source=.
echo "✅ GitHub repo created and code pushed!"

# Get the repo URL
REPO_URL=$(gh repo view --json url -q .url)
echo ""
echo "🎉 Your repo is live at: $REPO_URL"
echo ""
echo "========================================="
echo "Next steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repo 'tickle-app'"
echo "3. In the Vercel dashboard → Storage → Create Postgres database"
echo "4. Copy the env vars to your project settings"
echo "5. Set NEXTAUTH_SECRET (generate one with: openssl rand -base64 32)"
echo "6. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (from console.cloud.google.com)"
echo "7. Set GITHUB_ID, GITHUB_SECRET (from github.com/settings/developers)"
echo "8. Redeploy"
echo ""
echo "See SETUP.md for detailed instructions on each step."
echo "========================================="
