from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.election import Election
from models.office import Office
from models.candidate import Candidate
from models.vote import Vote
from extensions import db
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

def admin_required():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return user and user.is_admin

@admin_bp.route('/elections', methods=['POST'])
@jwt_required()
def create_election():
    try:
        if not admin_required():
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        election = Election(
            title=data.get('title'),
            description=data.get('description'),
            start_date=datetime.fromisoformat(data.get('startDate').replace('Z', '+00:00')),
            end_date=datetime.fromisoformat(data.get('endDate').replace('Z', '+00:00')),
            status=data.get('status', 'upcoming'),
            total_voters=User.query.filter_by(is_admin=False).count()  # Count non-admin users
        )
        
        db.session.add(election)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'election': election.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/elections/<int:election_id>', methods=['PUT'])
@jwt_required()
def update_election(election_id):
    try:
        if not admin_required():
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        election = Election.query.get(election_id)
        if not election:
            return jsonify({'success': False, 'error': 'Election not found'}), 404
        
        data = request.get_json()
        
        election.title = data.get('title', election.title)
        election.description = data.get('description', election.description)
        
        if data.get('startDate'):
            election.start_date = datetime.fromisoformat(data.get('startDate').replace('Z', '+00:00'))
        if data.get('endDate'):
            election.end_date = datetime.fromisoformat(data.get('endDate').replace('Z', '+00:00'))
        
        election.status = data.get('status', election.status)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'election': election.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/elections/<int:election_id>', methods=['DELETE'])
@jwt_required()
def delete_election(election_id):
    try:
        if not admin_required():
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        election = Election.query.get(election_id)
        if not election:
            return jsonify({'success': False, 'error': 'Election not found'}), 404
        
        db.session.delete(election)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Election deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/elections/<int:election_id>/offices', methods=['POST'])
@jwt_required()
def create_office(election_id):
    try:
        if not admin_required():
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        election = Election.query.get(election_id)
        if not election:
            return jsonify({'success': False, 'error': 'Election not found'}), 404
        
        data = request.get_json()
        
        office = Office(
            title=data.get('title'),
            description=data.get('description'),
            max_votes=data.get('maxVotes', 1),
            election_id=election_id
        )
        
        db.session.add(office)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'office': office.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/offices/<int:office_id>/candidates', methods=['POST'])
@jwt_required()
def create_candidate(office_id):
    try:
        if not admin_required():
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        office = Office.query.get(office_id)
        if not office:
            return jsonify({'success': False, 'error': 'Office not found'}), 404
        
        data = request.get_json()
        
        candidate = Candidate(
            name=data.get('name'),
            department=data.get('department'),
            level=data.get('level'),
            matric_no=data.get('matricNo'),
            manifesto=data.get('manifesto'),
            photo=data.get('photo'),
            office_id=office_id
        )
        
        db.session.add(candidate)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'candidate': candidate.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        if not admin_required():
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        total_elections = Election.query.count()
        active_elections = Election.query.filter_by(status='active').count()
        total_users = User.query.filter_by(is_admin=False).count()
        total_votes = Vote.query.count()
        
        # Calculate total candidates
        total_candidates = Candidate.query.count()
        
        # Calculate average turnout
        elections = Election.query.all()
        avg_turnout = 0
        if elections:
            turnouts = []
            for election in elections:
                if election.total_voters > 0:
                    turnout = (election.voted_count / election.total_voters) * 100
                    turnouts.append(turnout)
            avg_turnout = sum(turnouts) / len(turnouts) if turnouts else 0
        
        return jsonify({
            'success': True,
            'stats': {
                'totalElections': total_elections,
                'activeElections': active_elections,
                'totalVoters': total_users,
                'totalVotes': total_votes,
                'totalCandidates': total_candidates,
                'avgTurnout': round(avg_turnout, 1)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        if not admin_required():
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        users = User.query.filter_by(is_admin=False).all()
        
        users_data = []
        for user in users:
            user_data = user.to_dict()
            # Check if user has voted in any election
            has_voted = Vote.query.filter_by(user_id=user.id).first() is not None
            user_data['hasVoted'] = has_voted
            users_data.append(user_data)
        
        return jsonify({
            'success': True,
            'users': users_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
