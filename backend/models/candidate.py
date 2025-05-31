from extensions import db
from datetime import datetime

class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    level = db.Column(db.String(20), nullable=False)
    matric_no = db.Column(db.String(50), nullable=False)
    manifesto = db.Column(db.Text, nullable=False)
    photo = db.Column(db.String(255))  # URL or path to photo
    votes_count = db.Column(db.Integer, default=0)
    office_id = db.Column(db.Integer, db.ForeignKey('office.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    votes = db.relationship('Vote', backref='candidate', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'department': self.department,
            'level': self.level,
            'matricNo': self.matric_no,
            'manifesto': self.manifesto,
            'photo': self.photo,
            'votes': self.votes_count,
            'officeId': self.office_id,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }
