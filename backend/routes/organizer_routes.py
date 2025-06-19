from flask import Blueprint, jsonify, request, g
from models import Activity
from db import SessionLocal
from decorators import token_required
from datetime import datetime
from utils.link_validation import is_valid_link

organizer_routes_blueprint = Blueprint("organizers", __name__)

@organizer_routes_blueprint.route("/activities", methods=["POST"])
@token_required
def add_activity():
    data = request.json
    required_fields = ["title", "topic", "age_group", "date", "time", "join_link"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    if not is_valid_link(data["join_link"]):
        return jsonify({"error": "Invalid join link. Only Google Meet and Zoom allowed!"}), 400

    session = SessionLocal()
    try:
        activity = Activity(
            title=data["title"],
            topic=data["topic"],
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
    for field in ["title", "topic", "age_group", "date", "time", "join_link"]:
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
            {
                "id": a.id,
                "title": a.title,
                "topic": a.topic,
                "ageGroup": a.age_group,
                "date": a.date.isoformat(),
                "time": a.time,
                "joinLink": a.join_link,
                "organizer": a.organizer.name if hasattr(a.organizer, 'name') else None,
            }
            for a in activities
        ]

        return jsonify(result), 200
    except Exception as e:
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

    result = {
        "id": activity.id,
        "title": activity.title,
        "description": getattr(activity, "description", ""),
        "topic": activity.topic,
        "ageGroup": activity.age_group,
        "date": activity.date.isoformat(),
        "time": activity.time,
        "joinLink": activity.join_link,
    }

    session.close()
    return jsonify(result), 200
