from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.election import Election
from models.office import Office
from models.candidate import Candidate
from models.vote import Vote
from models.user import User
from extensions import db
from datetime import datetime, timezone

elections_bp = Blueprint('elections', __name__)

@elections_bp.route('/', methods=['GET'])
@jwt_required()
def get_elections():
    try:
        elections = Election.query.all()
        
        # Update election statuses
        for election in elections:
            election.update_status()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'elections': [election.to_dict() for election in elections]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@elections_bp.route('/<int:election_id>', methods=['GET'])
@jwt_required()
def get_election(election_id):
    try:
        election = Election.query.get(election_id)
        
        if not election:
            return jsonify({'success': False, 'error': 'Election not found'}), 404
        
        election.update_status()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'election': election.to_dict()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@elections_bp.route('/active', methods=['GET'])
@jwt_required()
def get_active_elections():
    try:
        now = datetime.now(timezone.utc)
        elections = Election.query.filter(
            Election.start_date <= now,
            Election.end_date > now
        ).all()
        
        for election in elections:
            election.status = 'active'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'elections': [election.to_dict() for election in elections]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@elections_bp.route('/upcoming', methods=['GET'])
@jwt_required()
def get_upcoming_elections():
    try:
        now = datetime.now(timezone.utc)
        elections = Election.query.filter(Election.start_date > now).all()
        
        for election in elections:
            election.status = 'upcoming'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'elections': [election.to_dict() for election in elections]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@elections_bp.route('/completed', methods=['GET'])
@jwt_required()
def get_completed_elections():
    try:
        now = datetime.now(timezone.utc)
        elections = Election.query.filter(Election.end_date <= now).all()
        
        for election in elections:
            election.status = 'completed'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'elections': [election.to_dict() for election in elections]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@elections_bp.route('/<int:election_id>/results', methods=['GET'])
@jwt_required()
def get_election_results(election_id):
    try:
        election = Election.query.get(election_id)
        
        if not election:
            return jsonify({'success': False, 'error': 'Election not found'}), 404
        
        # Calculate results for each office
        results = {}
        for office in election.offices:
            office_results = {
                'totalVotes': Vote.query.filter_by(election_id=election_id, office_id=office.id).count(),
                'candidates': []
            }
            
            for candidate in office.candidates:
                vote_count = Vote.query.filter_by(
                    election_id=election_id,
                    office_id=office.id,
                    candidate_id=candidate.id
                ).count()
                
                candidate_result = candidate.to_dict()
                candidate_result['votes'] = vote_count
                candidate_result['percentage'] = (vote_count / office_results['totalVotes'] * 100) if office_results['totalVotes'] > 0 else 0
                
                office_results['candidates'].append(candidate_result)
            
            # Sort candidates by vote count
            office_results['candidates'].sort(key=lambda x: x['votes'], reverse=True)
            results[office.title] = office_results
        
        return jsonify({
            'success': True,
            'results': results,
            'election': election.to_dict()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
