from flask import Flask
from db import engine, Base
from routes import bp

app = Flask(__name__)
app.register_blueprint(bp)

# Create DB tables
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    app.run(debug=True)
