from flask import Flask
from flask_cors import CORS
from db import engine, Base
from routes.activity_routes import activity_routes_blueprint
from routes.auth_routes import auth_routes_blueprint
from routes.organizer_routes import organizer_routes_blueprint
from dotenv import load_dotenv
import os
from extensions import limiter

load_dotenv()

app = Flask(__name__)

# Initialize extensions
limiter.init_app(app)

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
