# app/result/routes.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, MentalForm

from llama_cpp import Llama
import os

# ✅ Load the model once when this file is imported
MODEL_PATH = os.path.join(os.path.dirname(__file__), "mistral-7b-instruct-v0.3-q5_k_m.gguf")
llm = Llama(model_path=MODEL_PATH)

# Set up Blueprint
result_bp = Blueprint('result', __name__)

@result_bp.route("/", methods=["GET"])
@jwt_required()
def get_result():
    user_id = get_jwt_identity()

    form = MentalForm.query.filter_by(user_id=user_id).order_by(MentalForm.created_at.desc()).first()
    if not form:
        return jsonify({"error": "No form data found"}), 404

    # Create a prompt for the model
    prompt = f"""
Here is a user's self-assessment:
- Age: {form.age}
- Gender: {form.gender}
- Stress Level: {form.stress}/10
- Sleep Quality: {form.sleep}/10
- Appetite Changed: {form.appetite}
- Feeling Sad Often: {form.sadness}
- Difficulty Concentrating: {form.concentration}
- Social Withdrawal: {form.social}

Based on this information, provide a very short analysis (max 3 lines) of the user's mental health state.
"""

    # Get the prediction from LLM
    output = llm(prompt, max_tokens=256, echo=False)
    result_text = output["choices"][0]["text"].strip()

    return jsonify({
        "form": {
            "age": form.age,
            "gender": form.gender,
            "stress": form.stress,
            "sleep": form.sleep,
            "appetite": form.appetite,
            "sadness": form.sadness,
            "concentration": form.concentration,
            "social": form.social
        },
        "prediction": result_text
    })
