from flask import Blueprint, jsonify, request
from models import Activity
from db import SessionLocal
from datetime import datetime

activity_routes_blueprint = Blueprint("api", __name__)

@activity_routes_blueprint.route("/activities", methods=["GET"])
def get_activities():
    session = SessionLocal()

    topic = request.args.get("topic")
    age_group = request.args.get("age_group")
    time_filter = request.args.get("time")  # Morning / Afternoon / Evening

    query = session.query(Activity)

    if topic and topic != "All Topics":
        query = query.filter(Activity.topic == topic)

    if age_group and age_group != "All Ages":
        query = query.filter(Activity.age_group == age_group)

    if time_filter and time_filter != "All Times":
        def convert_time_to_hour(time_str):
            try:
                return datetime.strptime(time_str, "%I:%M %p").hour
            except ValueError:
                return None

        all_activities = query.all()
        filtered = []

        for a in all_activities:
            hour = convert_time_to_hour(a.time)
            if hour is None:
                continue

            if time_filter == "Morning" and hour < 12:
                filtered.append(a)
            elif time_filter == "Afternoon" and 12 <= hour < 17:
                filtered.append(a)
            elif time_filter == "Evening" and hour >= 17:
                filtered.append(a)
        activities = filtered
    else:
        activities = query.all()

    result = [
        {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "topic": a.topic,
            "ageGroup": a.age_group,
            "date": a.date.isoformat(),
            "time": a.time,
            "joinLink": a.join_link,
            "organizer": {
                "username": a.organizer.username,
            }
        }
        for a in activities
    ]

    session.close()
    return jsonify(result)

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