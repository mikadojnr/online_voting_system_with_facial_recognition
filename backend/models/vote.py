from extensions import db
from datetime import datetime

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    election_id = db.Column(db.Integer, db.ForeignKey('election.id'), nullable=False)
    office_id = db.Column(db.Integer, db.ForeignKey('office.id'), nullable=False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure one vote per user per office per election
    __table_args__ = (db.UniqueConstraint('user_id', 'election_id', 'office_id'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'electionId': self.election_id,
            'officeId': self.office_id,
            'candidateId': self.candidate_id,
            'timestamp': self.timestamp.isoformat()
        }
