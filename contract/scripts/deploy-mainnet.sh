#!/bin/bash
# Deploy Global BUSAN contracts to Sui mainnet

set -e

echo "================================================"
echo "WARNING: You are about to deploy to MAINNET!"
echo "================================================"
echo ""

# Navigate to contract directory
cd "$(dirname "$0")/.."

# Check if sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "Error: sui CLI not found. Please install Sui CLI first."
    echo "Visit: https://docs.sui.io/build/install"
    exit 1
fi

# Check active environment
echo "Active Sui environment:"
sui client active-env

# Confirm mainnet
read -p "Is this MAINNET? Type 'MAINNET' to confirm: " confirm
if [ "$confirm" != "MAINNET" ]; then
    echo "Deployment cancelled."
    exit 1
fi

# Build first
echo "Building contracts..."
sui move build

# Final confirmation
read -p "Ready to publish to MAINNET? This will cost real SUI! (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

# Publish to mainnet
echo "Publishing to mainnet..."
sui client publish --gas-budget 100000000 --skip-dependency-verification

echo ""
echo "================================================"
echo "MAINNET Deployment completed!"
echo "================================================"
echo "Please save the package ID and object IDs from the output above."
echo "Update these IDs in your frontend configuration (src/lib/smartContract.js)"
echo "Store these IDs securely in your production environment variables."
