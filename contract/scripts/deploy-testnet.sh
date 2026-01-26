#!/bin/bash
# Deploy Global BUSAN contracts to Sui testnet

set -e

echo "Deploying Global BUSAN contracts to Sui testnet..."

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

# Confirm testnet
read -p "Is this the correct environment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

# Build first
echo "Building contracts..."
sui move build

# Publish to testnet
echo "Publishing to testnet..."
sui client publish --gas-budget 100000000 --skip-dependency-verification

echo ""
echo "Deployment completed!"
echo "Please save the package ID and object IDs from the output above."
echo "Update these IDs in your frontend configuration (src/lib/smartContract.js)"
