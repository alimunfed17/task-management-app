#!/bin/bash

# Create a virtual environment if it doesn't exist
if [ ! -d "env" ]; then
    echo "Creating virtual environment..."
    python -m venv env
fi

# Activate the virtual environment
source env/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

echo "Setup complete! You can now run the application with:"
echo "source env/bin/activate && uvicorn app.main:app --reload" 