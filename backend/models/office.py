from extensions import db
from datetime import datetime

class Office(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    max_votes = db.Column(db.Integer, default=1)
    election_id = db.Column(db.Integer, db.ForeignKey('election.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    candidates = db.relationship('Candidate', backref='office', lazy=True, cascade='all, delete-orphan')
    votes = db.relationship('Vote', backref='office', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'maxVotes': self.max_votes,
            'electionId': self.election_id,
            'candidates': [candidate.to_dict() for candidate in self.candidates],
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }
