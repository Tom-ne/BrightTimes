from flask import Blueprint, jsonify, request
from models import Activity, Organizer
from db import SessionLocal
from datetime import datetime

activity_routes_blueprint = Blueprint("api", __name__)

@activity_routes_blueprint.route("/activities", methods=["GET"])
def get_activities():
    session = SessionLocal()

    topic = request.args.get("topic")
    age_group = request.args.get("age_group")

    query = session.query(Activity)

    if topic and topic != "All Topics":
        query = query.filter(Activity.topic == topic)

    if age_group and age_group != "All Ages":
        query = query.filter(Activity.age_group == age_group)

    # check if the activity date and time is in the past
    today = datetime.now().date()
    current_time = datetime.now().time()
    query = query.filter(
        (Activity.date > today) | 
        ((Activity.date == today) & (Activity.time >= current_time))
    )
    activities = query.all()

    result = [
        a.as_dict(include_relationships=True) for a in activities
    ]

    # Sort activities by date and time
    result.sort(key=lambda x: (x["date"], x["time"]))

    session.close()
    return jsonify(result)


@activity_routes_blueprint.route("/activities/<int:activity_id>/join", methods=["POST"])
def join_activity(activity_id):
    with SessionLocal() as session:
        activity = session.query(Activity).filter_by(id=activity_id).first()
        if not activity:
            return jsonify({"error": "Activity not found"}), 404
        activity.total_times_join_pressed += 1
        session.commit()
        return jsonify({"message": "Successfully joined the activity", "totalTimesJoinPressed": activity.total_times_join_pressed})


@activity_routes_blueprint.route("/activities/age_groups", methods=["GET"])
def get_age_groups():
    session = SessionLocal()
    age_groups = session.query(Activity.age_group).distinct().all()
    session.close()

    age_group_list = [age_group[0] for age_group in age_groups]
    return jsonify(age_group_list)


@activity_routes_blueprint.route("/activities/topics", methods=["GET"])
def get_topics():
    session = SessionLocal()
    topics = session.query(Activity.topic).distinct().all()
    session.close()

    topic_list = [topic[0] for topic in topics]
    return jsonify(topic_list)


@activity_routes_blueprint.route("/activities/<int:activity_id>", methods=["GET"])
def get_activity(activity_id):
    with SessionLocal() as session:
        activity = session.query(Activity).filter_by(id=activity_id).first()
        if not activity:
            return jsonify({"error": "Activity not found"}), 404
        data = activity.as_dict(include_relationships=True)
        return jsonify(data), 200


@activity_routes_blueprint.route("/activities/organizer/<int:organizer_id>", methods=["GET"])
def get_organizer_activities(organizer_id):
    with SessionLocal() as session:
        activities = session.query(Activity).filter_by(organizer_id=organizer_id).all()
        if not activities:
            return jsonify({"error": "No activities found for this organizer"}), 404
        result = [a.as_dict(include_relationships=True) for a in activities]
        return jsonify(result), 200