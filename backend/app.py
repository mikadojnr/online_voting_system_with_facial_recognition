from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
from extensions import db
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone, timedelta
import os
from config import Config

# Import models
from models import User


# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])


# Import routes
from routes.auth import auth_bp
from routes.elections import elections_bp
from routes.voting import voting_bp
from routes.admin import admin_bp
from routes.face_recognition import face_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(elections_bp, url_prefix='/api/elections')
app.register_blueprint(voting_bp, url_prefix='/api/voting')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(face_bp, url_prefix='/api/face')

@app.route('/')
def index():
    return redirect(url_for('api_info'))

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'FUO Online Voting System API is running',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'version': '1.0.0'
    })

@app.route('/api', methods=['GET'])
def api_info():
    """API information endpoint"""
    return jsonify({
        'name': 'FUO Online Voting System API',
        'description': 'Secure online voting system with CNN-based facial recognition',
        'version': '1.0.0',
        'university': 'Federal University Otuoke',
        'endpoints': {
            'auth': '/api/auth',
            'elections': '/api/elections',
            'voting': '/api/voting',
            'admin': '/api/admin',
            'face_recognition': '/api/face',
            'health': '/api/health'
        }
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found',
        'message': 'The requested resource does not exist'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        'success': False,
        'error': 'Bad request',
        'message': 'Invalid request data'
    }), 400

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({
        'success': False,
        'error': 'Unauthorized',
        'message': 'Authentication required'
    }), 401

@app.errorhandler(403)
def forbidden(error):
    return jsonify({
        'success': False,
        'error': 'Forbidden',
        'message': 'Insufficient permissions'
    }), 403

def create_tables():
    """Create database tables"""
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")

def seed_database():
    """Seed database with initial data"""
    from seed_data import seed_database
    with app.app_context():
        seed_database()
        print("Database seeded successfully!")

if __name__ == '__main__':
    # Create tables
    create_tables()
    
    # Seed database if empty
    with app.app_context():
        if User.query.count() == 0:
            seed_database()
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
