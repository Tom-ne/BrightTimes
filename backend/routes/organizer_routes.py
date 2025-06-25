from flask import Blueprint, jsonify, request, g
from models import Activity, Organizer
from db import SessionLocal
from decorators import token_required
from datetime import datetime
from utils.link_validation import is_valid_link
from collections import Counter

organizer_routes_blueprint = Blueprint("organizers", __name__)

@organizer_routes_blueprint.route("/activities", methods=["POST"])
@token_required
def add_activity():
    data = request.json
    required_fields = ["title", "description", "topic", "age_group", "date", "time", "join_link", "duration"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    if not is_valid_link(data["join_link"]):
        return jsonify({"error": "Invalid join link. Only Google Meet and Zoom allowed!"}), 400

    session = SessionLocal()
    try:
        activity = Activity(
            title=data["title"],
            topic=data["topic"],
            description=data["description"],
            age_group=data["age_group"],
            date=datetime.fromisoformat(data["date"]).date(),
            time=data["time"],
            join_link=data["join_link"],
            organizer_id=g.organizer_id
        )
        session.add(activity)
        session.commit()
        return jsonify({"message": "Activity created", "id": activity.id}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@organizer_routes_blueprint.route("/activities/<int:activity_id>", methods=["PUT"])
@token_required
def update_activity(activity_id):
    data = request.json
    session = SessionLocal()
    activity = session.query(Activity).filter_by(id=activity_id).first()

    if not activity:
        session.close()
        return jsonify({"error": "Activity not found"}), 404

    if activity.organizer_id != g.organizer_id:
        session.close()
        return jsonify({"error": "Unauthorized – you don't own this activity"}), 403

    # Update allowed fields
    for field in ["title", "description", "topic", "age_group", "date", "time", "join_link"]:
        if field in data:
            if field == "date":
                setattr(activity, field, datetime.fromisoformat(data[field]).date())
            else:
                setattr(activity, field, data[field])

    session.commit()
    session.close()
    return jsonify({"message": "Activity updated"})


@organizer_routes_blueprint.route("/activities/mine", methods=["GET"])
@token_required
def get_my_activities():
    session = SessionLocal()
    try:
        activities = session.query(Activity).filter_by(organizer_id=g.organizer_id).all()

        result = [
            a.as_dict(include_relationships=True) for a in activities
        ]

        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching activities: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@organizer_routes_blueprint.route("/activities/<int:activity_id>", methods=["GET"])
@token_required
def get_activity(activity_id):
    session = SessionLocal()
    activity = session.query(Activity).filter_by(id=activity_id).first()

    if not activity:
        session.close()
        return jsonify({"error": "Activity not found"}), 404

    if activity.organizer_id != g.organizer_id:
        session.close()
        return jsonify({"error": "Unauthorized – you don't own this activity"}), 403

    result = activity.as_dict(include_relationships=True)

    session.close()
    return jsonify(result), 200


@organizer_routes_blueprint.route("/organizer/me", methods=["GET"])
@token_required
def get_organizer_info():
    try:
        with SessionLocal() as session:
            organizer: Organizer = session.query(Organizer).filter_by(id=g.organizer_id).first()
            if not organizer:
                return jsonify({"error": "Organizer not found"}), 404

            # Convert organizer to dict using the mixin
            organizer_data = organizer.as_dict(include_relationships=True)
            # Remove password hash for security
            organizer_data.pop("password_hash", None)
            
            # Compute extra fields not part of the DB model
            activities = organizer.activities
            topic_counts = Counter(activity.topic for activity in activities)

            organizer_data.update({
                "totalActivities": len(activities),
                "totalTimesJoinPressed": sum(a.total_times_join_pressed for a in activities),
                "specialties": [topic for topic, _ in topic_counts.most_common(5)],
            })

            return jsonify(organizer_data), 200

    except Exception as e:
        print(f"Error in /organizer/me: {e}")
        return jsonify({"error": "Internal server error"}), 500


@organizer_routes_blueprint.route("/organizer/me", methods=["PUT"])
@token_required
def update_organizer_info():
    data = request.json
    session = SessionLocal()
    
    try:
        organizer = session.query(Organizer).filter_by(id=g.organizer_id).first()
        if not organizer:
            return jsonify({"error": "Organizer not found!"}), 404
        
        if "name" in data:
            organizer.name = data["name"]
        if "bio" in data:
            organizer.bio = data["bio"]
        if "avatarBase64" in data:
            organizer.avatar_base64 = data["avatarBase64"]
        
        session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()