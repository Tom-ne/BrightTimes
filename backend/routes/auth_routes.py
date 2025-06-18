from flask import Blueprint, jsonify, request
from models import Organizer
from db import SessionLocal

auth_routes_blueprint = Blueprint("auth", __name__)

@auth_routes_blueprint.route('/auth/login', methods=["GET"])
def login():
    pass
