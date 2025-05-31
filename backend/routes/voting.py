from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.election import Election
from models.office import Office
from models.candidate import Candidate
from models.vote import Vote
from models.user import User
from extensions import db
from datetime import datetime

voting_bp = Blueprint('voting', __name__)

@voting_bp.route('/cast', methods=['POST'])
@jwt_required()
def cast_votes():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        data = request.get_json()
        election_id = data.get('electionId')
        votes_data = data.get('votes')  # List of {officeId, candidateId}
        
        if not election_id or not votes_data:
            return jsonify({'success': False, 'error': 'Election ID and votes are required'}), 400
        
        election = Election.query.get(election_id)
        if not election:
            return jsonify({'success': False, 'error': 'Election not found'}), 404
        
        # Check if election is active
        election.update_status()
        if election.status != 'active':
            return jsonify({'success': False, 'error': 'Election is not active'}), 400
        
        # Check if user has already voted in this election
        existing_vote = Vote.query.filter_by(user_id=user_id, election_id=election_id).first()
        if existing_vote:
            return jsonify({'success': False, 'error': 'You have already voted in this election'}), 400
        
        # Validate and cast votes
        votes_to_add = []
        for vote_data in votes_data:
            office_id = vote_data.get('officeId')
            candidate_id = vote_data.get('candidateId')
            
            # Validate office belongs to election
            office = Office.query.filter_by(id=office_id, election_id=election_id).first()
            if not office:
                return jsonify({'success': False, 'error': f'Invalid office ID: {office_id}'}), 400
            
            # Validate candidate belongs to office
            candidate = Candidate.query.filter_by(id=candidate_id, office_id=office_id).first()
            if not candidate:
                return jsonify({'success': False, 'error': f'Invalid candidate ID: {candidate_id}'}), 400
            
            # Create vote record
            vote = Vote(
                user_id=user_id,
                election_id=election_id,
                office_id=office_id,
                candidate_id=candidate_id
            )
            votes_to_add.append(vote)
        
        # Add all votes to database
        for vote in votes_to_add:
            db.session.add(vote)
        
        # Update candidate vote counts
        for vote_data in votes_data:
            candidate = Candidate.query.get(vote_data.get('candidateId'))
            candidate.votes_count += 1
        
        # Update election voted count
        election.voted_count += 1
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Votes cast successfully',
            'votesCount': len(votes_to_add)
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@voting_bp.route('/status/<int:election_id>', methods=['GET'])
@jwt_required()
def get_voting_status(election_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if user has voted in this election
        votes = Vote.query.filter_by(user_id=user_id, election_id=election_id).all()
        
        return jsonify({
            'success': True,
            'hasVoted': len(votes) > 0,
            'votesCount': len(votes),
            'votes': [vote.to_dict() for vote in votes]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@voting_bp.route('/history', methods=['GET'])
@jwt_required()
def get_voting_history():
    try:
        user_id = get_jwt_identity()
        
        votes = Vote.query.filter_by(user_id=user_id).all()
        
        # Group votes by election
        history = {}
        for vote in votes:
            election_id = vote.election_id
            if election_id not in history:
                election = Election.query.get(election_id)
                history[election_id] = {
                    'election': election.to_dict(),
                    'votes': []
                }
            
            vote_data = vote.to_dict()
            vote_data['office'] = vote.office.to_dict()
            vote_data['candidate'] = vote.candidate.to_dict()
            history[election_id]['votes'].append(vote_data)
        
        return jsonify({
            'success': True,
            'history': list(history.values())
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
