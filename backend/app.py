from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from db import engine, Base
from routes.activity_routes import activity_routes_blueprint
from routes.auth_routes import auth_routes_blueprint
from routes.organizer_routes import organizer_routes_blueprint
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Rate Limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["ALGORITHM"] = os.getenv("ALGORITHM")

# Register Blueprints
app.register_blueprint(activity_routes_blueprint)
app.register_blueprint(auth_routes_blueprint)
app.register_blueprint(organizer_routes_blueprint)

# Create DB tables
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    app.run(debug=True)
