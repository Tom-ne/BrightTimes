from functools import wraps
from flask import request, jsonify, current_app, g
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[-1]

        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            data = jwt.decode(
                token,
                current_app.config["SECRET_KEY"],
                algorithms=[current_app.config["ALGORITHM"]]
            )
            # Attach to global request context
            g.organizer_id = data["organizer_id"]
            g.username = data["username"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated
