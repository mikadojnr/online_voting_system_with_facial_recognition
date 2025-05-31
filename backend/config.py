"""
Configuration settings for FUO Online Voting System
"""

import os
from datetime import timedelta

class Config:
    # Basic Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'fuo-voting-system-secret-key-2025'
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///fuo_voting_system.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'fuo-jwt-secret-key-2025'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Face recognition configuration
    FACE_RECOGNITION_THRESHOLD = 0.6
    FACE_DETECTION_MODEL = 'cnn'  # or 'hog', 'cnn' for better accuracy
    
    # CNN Model configuration
    CNN_MODEL_PATH = 'models/trained/face_recognition_cnn.h5'
    FACE_DATASET_PATH = 'datasets/faces'
    TRAINING_SPLIT = 0.7  # 70% for training, 30% for testing
    
    # Image processing configuration
    IMAGE_SIZE = (224, 224)  # Standard input size for CNN
    BATCH_SIZE = 32
    EPOCHS = 50
    LEARNING_RATE = 0.001
    
    # Security configuration
    MAX_LOGIN_ATTEMPTS = 5
    LOCKOUT_DURATION = timedelta(minutes=30)
    
    # File upload configuration
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    
    # Logging configuration
    LOG_LEVEL = 'INFO'
    LOG_FILE = 'logs/voting_system.log'

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test_voting_system.db'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
