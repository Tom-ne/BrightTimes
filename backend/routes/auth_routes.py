from flask import Blueprint, jsonify, request, current_app
from models import Organizer
from db import SessionLocal
import datetime
import jwt

auth_routes_blueprint = Blueprint("auth", __name__)

@auth_routes_blueprint.route('/auth/login', methods=["GET"])
def login():
    username = request.args.get("username")
    password_hash = request.args.get("password_hash")

    if not username or not password_hash:
        return jsonify({"error": "Username and password_hash are required"}), 400
    
    session = SessionLocal()
    organizer = session.query(Organizer).filter_by(username=username).first()

    if not organizer or organizer.password_hash != password_hash:
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
