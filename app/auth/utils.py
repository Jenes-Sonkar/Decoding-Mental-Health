from flask import request, jsonify
from functools import wraps
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request
from app.models import User
from datetime import timedelta

# Optional: Default expiry if needed
DEFAULT_EXPIRY = timedelta(days=365 * 100)  # 100 years

def generate_token(user_id, expires_delta=DEFAULT_EXPIRY):
    return create_access_token(identity=str(user_id), expires_delta=expires_delta)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = int(get_jwt_identity())
            user = User.query.get(user_id)
            if not user:
                return jsonify({'message': 'User not found'}), 401

            return f(user, *args, **kwargs)

        except Exception as e:
            return jsonify({'message': f'Token is invalid or expired: {str(e)}'}), 401

    return decorated
