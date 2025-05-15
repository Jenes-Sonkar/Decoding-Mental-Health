from . import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

class MentalForm(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    stress = db.Column(db.Integer)
    sleep = db.Column(db.Integer)
    appetite = db.Column(db.String(10))
    sadness = db.Column(db.String(10))
    concentration = db.Column(db.String(10))
    social = db.Column(db.String(10))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
