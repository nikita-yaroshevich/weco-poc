#!/usr/bin/env bash
echo "Development Mode"

npm install

concurrently --kill-others \"npm run start:dev:admin\"