from flask import Blueprint, jsonify, request, current_app
from models import Organizer
from db import SessionLocal
import datetime
import jwt
from utils.security import verify_password  # your hashlib-based verifier

auth_routes_blueprint = Blueprint("auth", __name__)

@auth_routes_blueprint.route('/auth/login', methods=["GET"])
def login():
    username = request.args.get("username")
    password = request.args.get("password")  # plain password from client

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    session = SessionLocal()
    organizer = session.query(Organizer).filter_by(username=username).first()

    if not organizer or not verify_password(organizer.password_hash, password):
        session.close()
        return jsonify({"error": "Invalid credentials"}), 401

    payload = {
        "organizer_id": organizer.id,
        "username": organizer.username,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=60)
    }
    token = jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm=current_app.config["ALGORITHM"])

    session.close()
    return jsonify({"token": token, "username": organizer.username})
