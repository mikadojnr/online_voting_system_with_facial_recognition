"""
Face Recognition API Routes for CNN-based facial authentication
"""

from flask import Blueprint, current_app, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import cv2
import numpy as np
from datetime import datetime, timezone
import base64
import io
from PIL import Image
import logging

from models.user import User
from models.face_data import FaceData
from utils.cnn_face_recognition import face_recognition_system
from extensions import db

logger = logging.getLogger(__name__)

face_bp = Blueprint('face', __name__)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}
def decode_base64_image(base64_string):
    """Decode base64 image string to numpy array"""
    try:
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to numpy array
        image_array = np.array(image)
        
        # Convert RGB to BGR for OpenCV
        if len(image_array.shape) == 3:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
        
        return image_array
    except Exception as e:
        current_app.logger.error(f"Error decoding base64 image: {str(e)}")
        return None

@face_bp.route('/register', methods=['POST'])
@jwt_required()
def register_face():
    """
    Register face data for a user
    
    Expected JSON:
    {
        "face_data": "base64_encoded_image"
    }
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'face_data' not in data:
            return jsonify({
                'success': False,
                'error': 'Face data is required'
            }), 400
        
        face_data = data['face_data']
        
        # Register face using CNN system
        result = face_recognition_system.register_face(face_data, current_user_id)
        
        if result['success']:
            # Save face data to database
            existing_face_data = FaceData.query.filter_by(user_id=current_user_id).first()
            
            if existing_face_data:
                existing_face_data.face_encoding = face_data
                existing_face_data.updated_at = db.func.current_timestamp()
            else:
                new_face_data = FaceData(
                    user_id=current_user_id,
                    face_encoding=face_data
                )
                db.session.add(new_face_data)
            
            # Update user's face registration status
            user = User.query.get(current_user_id)
            if user:
                user.face_registered = True
            
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Face registered successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Face registration failed')
            }), 400
            
    except Exception as e:
        logger.error(f"Face registration error: {str(e)}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@face_bp.route('/verify', methods=['POST'])
@jwt_required()
def verify_face():
    """
    Verify face data against registered face
    
    Expected JSON:
    {
        "face_data": "base64_encoded_image"
    }
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'face_data' not in data:
            return jsonify({
                'success': False,
                'error': 'Face data is required'
            }), 400
        
        face_data = data['face_data']
        
        # Check if user has registered face data
        user_face_data = FaceData.query.filter_by(user_id=current_user_id).first()
        if not user_face_data:
            return jsonify({
                'success': False,
                'error': 'No face data registered for this user'
            }), 400
        
        # Verify face using CNN system
        result = face_recognition_system.verify_face(face_data, current_user_id)
        
        return jsonify({
            'success': result['success'],
            'confidence': result['confidence'],
            'threshold': result.get('threshold', 0.85),
            'message': 'Face verified successfully' if result['success'] else 'Face verification failed'
        })
        
    except Exception as e:
        logger.error(f"Face verification error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@face_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_face():
    """
    Update registered face data for a user
    
    Expected JSON:
    {
        "face_data": "base64_encoded_image"
    }
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'face_data' not in data:
            return jsonify({
                'success': False,
                'error': 'Face data is required'
            }), 400
        
        face_data = data['face_data']
        
        # Register/update face using CNN system
        result = face_recognition_system.register_face(face_data, current_user_id)
        
        if result['success']:
            # Update face data in database
            face_record = FaceData.query.filter_by(user_id=current_user_id).first()
            
            if face_record:
                face_record.face_encoding = face_data
                face_record.updated_at = db.func.current_timestamp()
            else:
                new_face_data = FaceData(
                    user_id=current_user_id,
                    face_encoding=face_data
                )
                db.session.add(new_face_data)
            
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Face data updated successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Face update failed')
            }), 400
            
    except Exception as e:
        logger.error(f"Face update error: {str(e)}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@face_bp.route('/train', methods=['POST'])
@jwt_required()
def train_model():
    """
    Train the CNN model with current face data (Admin only)
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_admin:
            return jsonify({
                'success': False,
                'error': 'Admin access required'
            }), 403
        
        # Get all face data from database
        face_data_records = FaceData.query.all()
        
        if len(face_data_records) < 2:
            return jsonify({
                'success': False,
                'error': 'Insufficient face data for training (minimum 2 users required)'
            }), 400
        
        # Prepare training data
        training_data = []
        for record in face_data_records:
            training_data.append({
                'user_id': record.user_id,
                'face_data': record.face_encoding
            })
        
        # Train the model
        history = face_recognition_system.train_model(training_data)
        
        if history is not None:
            return jsonify({
                'success': True,
                'message': 'Model trained successfully',
                'training_samples': len(training_data)
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Model training failed'
            }), 500
            
    except Exception as e:
        logger.error(f"Model training error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@face_bp.route('/model-info', methods=['GET'])
@jwt_required()
def get_model_info():
    """
    Get information about the current CNN model
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_admin:
            return jsonify({
                'success': False,
                'error': 'Admin access required'
            }), 403
        
        # Get model information
        model_loaded = face_recognition_system.model is not None
        encoder_loaded = face_recognition_system.label_encoder is not None
        
        total_registered_faces = FaceData.query.count()
        
        model_info = {
            'model_loaded': model_loaded,
            'encoder_loaded': encoder_loaded,
            'total_registered_faces': total_registered_faces,
            'confidence_threshold': face_recognition_system.confidence_threshold,
            'image_size': face_recognition_system.img_size
        }
        
        if model_loaded and encoder_loaded:
            model_info['num_classes'] = len(face_recognition_system.label_encoder.classes_)
        
        return jsonify({
            'success': True,
            'model_info': model_info
        })
        
    except Exception as e:
        logger.error(f"Model info error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@face_bp.route('/train-model', methods=['POST'])
@jwt_required()
def train_cnn_model():
    """
    Train CNN model on facial recognition dataset (Admin only)
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin:
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        # Get training parameters
        data = request.get_json() or {}
        dataset_path = data.get('dataset_path', 'datasets/faces')
        epochs = data.get('epochs', 50)
        batch_size = data.get('batch_size', 32)
        
        if not os.path.exists(dataset_path):
            return jsonify({'success': False, 'error': 'Dataset path not found'}), 400
        
        # Train model
        current_app.logger.info(f"Starting CNN model training with {epochs} epochs")
        
        history = CNNFaceRecognition.train_model(
            dataset_path=dataset_path,
            epochs=epochs,
            batch_size=batch_size
        )
        
        if history is None:
            return jsonify({'success': False, 'error': 'Model training failed'}), 500
        
        # Get final training metrics
        final_accuracy = history.history['accuracy'][-1]
        final_val_accuracy = history.history['val_accuracy'][-1]
        
        current_app.logger.info(f"Model training completed. Final accuracy: {final_accuracy:.4f}")
        
        return jsonify({
            'success': True,
            'message': 'CNN model trained successfully',
            'final_accuracy': final_accuracy,
            'final_val_accuracy': final_val_accuracy,
            'epochs_completed': len(history.history['accuracy']),
            'model_path': CNNFaceRecognition.model_path
        })
        
    except Exception as e:
        current_app.logger.error(f"Error training CNN model: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@face_bp.route('/model-status', methods=['GET'])
@jwt_required()
def get_model_status():
    """
    Get CNN model status and statistics
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin:
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        # Check if model exists
        model_exists = os.path.exists(CNNFaceRecognition.model_path)
        model_loaded = CNNFaceRecognition.model is not None
        
        # Get face data statistics
        total_face_data = FaceData.query.count()
        verified_faces = FaceData.query.filter_by(is_verified=True).count()
        training_data_count = FaceData.query.filter_by(is_training_data=True).count()
        
        # Get registered users count
        registered_users = User.query.filter_by(face_registered=True).count()
        
        status = {
            'model_exists': model_exists,
            'model_loaded': model_loaded,
            'model_path': CNNFaceRecognition.model_path,
            'confidence_threshold': CNNFaceRecognition.confidence_threshold,
            'statistics': {
                'total_face_data': total_face_data,
                'verified_faces': verified_faces,
                'training_data_count': training_data_count,
                'registered_users': registered_users
            }
        }
        
        # Load training history if available
        history_path = 'models/trained/training_history.json'
        if os.path.exists(history_path):
            import json
            with open(history_path, 'r') as f:
                training_history = json.load(f)
                status['last_training'] = {
                    'final_accuracy': training_history['accuracy'][-1],
                    'final_val_accuracy': training_history['val_accuracy'][-1],
                    'epochs': len(training_history['accuracy'])
                }
        
        return jsonify({'success': True, 'status': status})
        
    except Exception as e:
        current_app.logger.error(f"Error getting model status: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@face_bp.route('/dataset/upload', methods=['POST'])
@jwt_required()
def upload_training_data():
    """
    Upload training data for CNN model (Admin only)
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin:
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        if 'images' not in request.files:
            return jsonify({'success': False, 'error': 'No images provided'}), 400
        
        files = request.files.getlist('images')
        target_user_id = request.form.get('user_id')
        
        if not target_user_id:
            return jsonify({'success': False, 'error': 'User ID required'}), 400
        
        target_user = User.query.get(target_user_id)
        if not target_user:
            return jsonify({'success': False, 'error': 'Target user not found'}), 404
        
        # Create dataset directory
        dataset_path = f"datasets/faces/{target_user.student_id}"
        os.makedirs(dataset_path, exist_ok=True)
        
        uploaded_count = 0
        
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                timestamp = datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')
                filename = f"{timestamp}_{filename}"
                file_path = os.path.join(dataset_path, filename)
                
                file.save(file_path)
                uploaded_count += 1
        
        current_app.logger.info(f"Uploaded {uploaded_count} training images for user {target_user_id}")
        
        return jsonify({
            'success': True,
            'message': f'Uploaded {uploaded_count} training images',
            'user_id': target_user_id,
            'dataset_path': dataset_path
        })
        
    except Exception as e:
        current_app.logger.error(f"Error uploading training data: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
