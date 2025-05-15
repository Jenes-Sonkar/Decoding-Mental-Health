from flask import Blueprint, request, jsonify
from app import db
from app.models import MentalForm
from app.auth.utils import token_required

form_bp = Blueprint('form', __name__)

@form_bp.route('/submit', methods=['POST'])
@token_required
def submit_form(current_user):
    data = request.json

    form = MentalForm(
        user_id=current_user.id,
        age=data.get('age'),
        gender=data.get('gender'),
        stress=data.get('stress'),
        sleep=data.get('sleep'),
        appetite=data.get('appetite'),
        sadness=data.get('sadness'),
        concentration=data.get('concentration'),
        social=data.get('social')
    )

    db.session.add(form)
    db.session.commit()

    return jsonify({"message": "Form submitted", "form_id": form.id}), 201


