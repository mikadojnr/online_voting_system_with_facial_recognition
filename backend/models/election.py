from extensions import db
from datetime import datetime, timezone

class Election(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='upcoming')  # upcoming, active, completed
    total_voters = db.Column(db.Integer, default=0)
    voted_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    offices = db.relationship('Office', backref='election', lazy=True, cascade='all, delete-orphan')
    votes = db.relationship('Vote', backref='election', lazy=True)
    
    def update_status(self):
        now = datetime.now(timezone.utc)

        if now < self.start_date:
            self.status = 'upcoming'
        elif now > self.end_date:
            self.status = 'completed'
        else:
            self.status = 'active'
    
    def to_dict(self):
        self.update_status()
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'startDate': self.start_date.isoformat(),
            'endDate': self.end_date.isoformat(),
            'status': self.status,
            'totalVoters': self.total_voters,
            'votedCount': self.voted_count,
            'offices': [office.to_dict() for office in self.offices],
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }
