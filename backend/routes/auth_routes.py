from flask import Blueprint, jsonify, request, current_app
from models import Organizer, TokenBlocklist
from db import SessionLocal
import datetime
import jwt
import uuid
from utils.security import verify_password  # your hashlib-based verifier
from extensions import limiter
from decorators import token_required

auth_routes_blueprint = Blueprint("auth", __name__)

@auth_routes_blueprint.route('/auth/login', methods=["POST"])
@limiter.limit("10 per minute")
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    session = SessionLocal()
    organizer = session.query(Organizer).filter_by(username=username).first()

    if not organizer or not verify_password(organizer.password_hash, password):
        session.close()
        return jsonify({"error": "Invalid credentials"}), 401

    # Create access token
    access_payload = {
        "organizer_id": organizer.id,
        "username": organizer.username,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15),
        "jti": str(uuid.uuid4()),
        "type": "access"
    }
    access_token = jwt.encode(access_payload, current_app.config["SECRET_KEY"], algorithm=current_app.config["ALGORITHM"])

    # Create refresh token
    refresh_payload = {
        "organizer_id": organizer.id,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7),
        "jti": str(uuid.uuid4()),
        "type": "refresh"
    }
    refresh_token = jwt.encode(refresh_payload, current_app.config["SECRET_KEY"], algorithm=current_app.config["ALGORITHM"])

    session.close()
    return jsonify({"access_token": access_token, "refresh_token": refresh_token, "username": organizer.username})


@auth_routes_blueprint.route("/auth/refresh", methods=["POST"])
@token_required
def refresh():
    token = request.headers["Authorization"].split(" ")[-1]
    try:
        data = jwt.decode(
            token,
            current_app.config["SECRET_KEY"],
            algorithms=[current_app.config["ALGORITHM"]]
        )
        if data.get("type") != "refresh":
            return jsonify({"error": "Invalid token type"}), 401

        # Create new access token
        access_payload = {
            "organizer_id": data["organizer_id"],
            "username": data.get("username"),
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15),
            "jti": str(uuid.uuid4()),
            "type": "access"
        }
        access_token = jwt.encode(access_payload, current_app.config["SECRET_KEY"], algorithm=current_app.config["ALGORITHM"])
        return jsonify({"access_token": access_token}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Refresh token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid refresh token"}), 401


@auth_routes_blueprint.route("/auth/logout", methods=["POST"])
@token_required
def logout():
    token = request.headers["Authorization"].split(" ")[-1]
    try:
        data = jwt.decode(
            token,
            current_app.config["SECRET_KEY"],
            algorithms=[current_app.config["ALGORITHM"]]
        )
        jti = data.get("jti")
        if jti:
            session = SessionLocal()
            session.add(TokenBlocklist(jti=jti))
            session.commit()
            session.close()
        return jsonify({"message": "Successfully logged out"}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
