from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from extensions import db
import json

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'success': True,
                'user': user.to_dict(),
                'access_token': access_token
            })
        else:
            return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Check if user already exists
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'success': False, 'error': 'Email already registered'}), 400
        
        if User.query.filter_by(student_id=data.get('studentId')).first():
            return jsonify({'success': False, 'error': 'Student ID already registered'}), 400
        
        # Create new user
        user = User(
            name=data.get('name'),
            student_id=data.get('studentId'),
            email=data.get('email'),
            phone=data.get('phone'),
            face_registered=bool(data.get('faceData'))
        )
        user.set_password(data.get('password'))
        
        # Store face encoding if provided
        if data.get('faceData'):
            user.face_encoding = json.dumps({'encoding': 'placeholder'})  # In real app, process face data
        
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'user': user.to_dict(),
            'access_token': access_token
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/verify-face', methods=['POST'])
@jwt_required()
def verify_face():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        # In a real implementation, you would:
        # 1. Process the uploaded face image
        # 2. Compare with stored face encoding
        # 3. Return success/failure based on match
        
        # For demo purposes, simulate 90% success rate
        import random
        success = random.random() > 0.1
        
        if success:
            return jsonify({'success': True, 'message': 'Face verification successful'})
        else:
            return jsonify({'success': False, 'error': 'Face verification failed'}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        # Get user's voting history
        from models.vote import Vote
        votes = Vote.query.filter_by(user_id=user_id).all()
        voting_history = [vote.to_dict() for vote in votes]
        
        user_data = user.to_dict()
        user_data['votedOffices'] = voting_history
        
        return jsonify({'success': True, 'user': user_data})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'name' in data:
            user.name = data['name']
        if 'phone' in data:
            user.phone = data['phone']
        
        db.session.commit()
        
        return jsonify({'success': True, 'user': user.to_dict()})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
