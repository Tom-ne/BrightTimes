from flask import Blueprint, jsonify, request, g
from models import Activity, Organizer
from db import SessionLocal
from decorators import token_required
from datetime import datetime, timedelta
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
            organizer_id=g.organizer_id,
            duration=data["duration"],
            materials=data.get("materials", "")
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


@organizer_routes_blueprint.route("/activities/<int:activity_id>", methods=["DELETE"])
@token_required
def delete_activity(activity_id):
    with SessionLocal() as session:
        activity = session.query(Activity).filter_by(id=activity_id).first()
        if not activity:
            return jsonify({"error": "Activity not found"}), 404
        if activity.organizer_id != g.organizer_id:
            return jsonify({"error": "Unauthorized – you don't own this activity"}), 403
        session.delete(activity)
        session.commit()
        return jsonify({"message": "Activity deleted"}), 200


@organizer_routes_blueprint.route("/activities/mine", methods=["GET"])
@token_required
def get_my_activities():
    session = SessionLocal()
    try:
        activities = session.query(Activity).filter_by(organizer_id=g.organizer_id).all()
        result = [a.as_dict(include_relationships=True) for a in activities]

        today = datetime.now().date()
        now = datetime.now().time()

        # Calculate the current week's Sunday and Saturday
        weekday = today.weekday()  # Monday=0 ... Sunday=6
        days_since_sunday = (weekday + 1) % 7
        sunday_start = today - timedelta(days=days_since_sunday)
        saturday_end = sunday_start + timedelta(days=6)

        for activity in result:
            # Parse activity date
            if isinstance(activity["date"], str):
                activity_date = datetime.fromisoformat(activity["date"]).date()
            else:
                activity_date = activity["date"]

            # Parse activity time
            activity_time = datetime.strptime(activity["time"], "%H:%M").time()

            # isPast flag: activity date/time before now
            activity["isPast"] = activity_date < today or (activity_date == today and activity_time < now)

            # isThisWeek flag: activity date between this Sunday and Saturday, and not in the past
            activity["isThisWeek"] = (sunday_start <= activity_date <= saturday_end) and (activity_date >= today)

        # Sort activities by date/time descending (most recent first)
        result.sort(key=lambda x: (x["date"], x["time"]), reverse=True)

        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching activities: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()


@organizer_routes_blueprint.route("/organizer/me", methods=["GET"])
@token_required
def get_organizer_info():
    try:
        with SessionLocal() as session:
            organizer: Organizer = session.query(Organizer).filter_by(id=g.organizer_id).first()
            if not organizer:
                return jsonify({"error": "Organizer not found"}), 404

            # Convert organizer to dict using the mixin
            organizer_data = organizer.as_dict()
            
            # Compute extra fields not part of the DB model
            # get all activities for this organizer
            activities = session.query(Activity).filter_by(organizer_id=g.organizer_id).all()

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