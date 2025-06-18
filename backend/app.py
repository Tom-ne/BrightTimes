from flask import Flask
from db import engine, Base
from routes.activity_routes import activity_routes_blueprint

app = Flask(__name__)
app.register_blueprint(activity_routes_blueprint)

# Create DB tables
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    app.run(debug=True)
