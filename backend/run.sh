#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Initialize database
python seed_data.py

# Run the Flask application
python app.py
