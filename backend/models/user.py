"""
Enhanced User Model with facial recognition integration
"""

from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone

class User(db.Model):
    """
    Enhanced User model for FUO Voting System with facial recognition
    """
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Personal Information
    name = db.Column(db.String(100), nullable=False)
    student_id = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    
    # Academic Information
    department = db.Column(db.String(100), nullable=False)
    level = db.Column(db.String(20), nullable=False)  # 100, 200, 300, 400, 500, Staff
    
    # Authentication
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    
    # Facial Recognition
    face_registered = db.Column(db.Boolean, default=False)
    face_verification_enabled = db.Column(db.Boolean, default=True)
    face_registration_date = db.Column(db.DateTime)
    last_face_verification = db.Column(db.DateTime)
    
    # Security
    login_attempts = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime)
    last_login = db.Column(db.DateTime)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    votes = db.relationship('Vote', backref='voter', lazy=True)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def is_locked(self):
        """Check if account is locked due to failed login attempts"""
        if self.locked_until and self.locked_until > datetime.now(timezone.utc):
            return True
        return False
    
    def increment_login_attempts(self):
        """Increment failed login attempts"""
        self.login_attempts += 1
        if self.login_attempts >= 5:  # Lock after 5 failed attempts
            self.locked_until = datetime.now(timezone.utc) + timedelta(minutes=30)
    
    def reset_login_attempts(self):
        """Reset login attempts after successful login"""
        self.login_attempts = 0
        self.locked_until = None
        self.last_login = datetime.now(timezone.utc)
    
    def can_vote_in_election(self, election_id):
        """Check if user can vote in specific election"""
        from models.vote import Vote
        existing_vote = Vote.query.filter_by(
            user_id=self.id,
            election_id=election_id
        ).first()
        return existing_vote is None
    
    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary"""
        data = {
            'id': self.id,
            'name': self.name,
            'studentId': self.student_id,
            'email': self.email,
            'phone': self.phone,
            'department': self.department,
            'level': self.level,
            'isAdmin': self.is_admin,
            'isActive': self.is_active,
            'faceRegistered': self.face_registered,
            'faceVerificationEnabled': self.face_verification_enabled,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }
        
        if include_sensitive:
            data.update({
                'loginAttempts': self.login_attempts,
                'isLocked': self.is_locked(),
                'lastLogin': self.last_login.isoformat() if self.last_login else None,
                'faceRegistrationDate': self.face_registration_date.isoformat() if self.face_registration_date else None,
                'lastFaceVerification': self.last_face_verification.isoformat() if self.last_face_verification else None
            })
        
        return data
