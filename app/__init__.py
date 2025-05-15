from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager  # Import JWTManager
import os

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()  # Initialize JWTManager here

def create_app():
    load_dotenv()  # ✅ Load .env before accessing config

    app = Flask(__name__)
    app.config.from_object("config.Config")

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)  # ✅ Setup JWT
    CORS(app)

    from app.auth.routes import auth_bp
    from app.form.routes import form_bp
    from app.result.routes import result_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(form_bp, url_prefix="/api/form")
    app.register_blueprint(result_bp, url_prefix="/api/result")

    with app.app_context():
        db.create_all()
    return app
