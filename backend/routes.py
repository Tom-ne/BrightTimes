from flask import Blueprint, jsonify, request
from models import Activity
from db import SessionLocal

bp = Blueprint("api", __name__)

@bp.route("/activities", methods=["GET"])
def get_activities():
    session = SessionLocal()
    activities = session.query(Activity).all()
    result = [
        {
            "id": a.id,
            "title": a.title,
            "topic": a.topic,
            "ageGroup": a.age_group,
            "date": a.date.isoformat(),
            "time": a.time,
            "joinLink": a.join_link,
            "organizer": a.organizer,
        }
        for a in activities
    ]
    session.close()
    return jsonify(result)
