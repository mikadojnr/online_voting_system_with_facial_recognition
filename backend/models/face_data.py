"""
Face Data Model for storing facial recognition data
"""

from extensions import db
from datetime import datetime
import json

class FaceData(db.Model):
    """
    Model for storing facial recognition data and training information
    """
    __tablename__ = 'face_data'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Face encoding data
    face_encoding = db.Column(db.Text, nullable=False)  # JSON string of face encoding
    face_landmarks = db.Column(db.Text)  # JSON string of facial landmarks
    
    # Image metadata
    image_path = db.Column(db.String(255))
    image_hash = db.Column(db.String(64))  # SHA-256 hash for integrity
    image_quality_score = db.Column(db.Float, default=0.0)
    
    # Training data
    is_training_data = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    verification_attempts = db.Column(db.Integer, default=0)
    last_verification = db.Column(db.DateTime)
    
    # CNN model data
    cnn_features = db.Column(db.Text)  # JSON string of CNN extracted features
    confidence_score = db.Column(db.Float, default=0.0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('face_data', lazy=True))
    
    def set_face_encoding(self, encoding):
        """Store face encoding as JSON string"""
        self.face_encoding = json.dumps(encoding.tolist() if hasattr(encoding, 'tolist') else encoding)
    
    def get_face_encoding(self):
        """Retrieve face encoding as numpy array"""
        import numpy as np
        return np.array(json.loads(self.face_encoding))
    
    def set_face_landmarks(self, landmarks):
        """Store facial landmarks as JSON string"""
        self.face_landmarks = json.dumps(landmarks)
    
    def get_face_landmarks(self):
        """Retrieve facial landmarks"""
        return json.loads(self.face_landmarks) if self.face_landmarks else None
    
    def set_cnn_features(self, features):
        """Store CNN extracted features as JSON string"""
        self.cnn_features = json.dumps(features.tolist() if hasattr(features, 'tolist') else features)
    
    def get_cnn_features(self):
        """Retrieve CNN features as numpy array"""
        import numpy as np
        return np.array(json.loads(self.cnn_features)) if self.cnn_features else None
    
    def to_dict(self):
        """Convert face data to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_quality_score': self.image_quality_score,
            'is_verified': self.is_verified,
            'verification_attempts': self.verification_attempts,
            'confidence_score': self.confidence_score,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
