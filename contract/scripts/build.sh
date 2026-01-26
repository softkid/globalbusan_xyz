#!/bin/bash
# Build and test Sui Move contracts

set -e

echo "Building Global BUSAN Sui Move contracts..."

# Navigate to contract directory
cd "$(dirname "$0")/.."

# Build the Move package
echo "Running sui move build..."
sui move build

# Run Move tests
echo "Running sui move test..."
sui move test

echo "Build and test completed successfully!"
echo ""
echo "To publish to testnet, run:"
echo "  sui client publish --gas-budget 100000000"
echo ""
echo "To publish to mainnet, run:"
echo "  sui client publish --gas-budget 100000000"
