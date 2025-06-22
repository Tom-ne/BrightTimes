from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from db import Base
from datetime import date

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    age_group = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    time = Column(String, nullable=False)
    join_link = Column(String, nullable=False)
    
    total_times_join_pressed = Column(Integer, default=0)
    
    organizer_id = Column(Integer, ForeignKey("organizers.id"), nullable=False)
    organizer = relationship("Organizer", back_populates="activities")


class Organizer(Base):
    __tablename__ = "organizers"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    # New fields
    name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    avatar_base64 = Column(Text, nullable=True)  # Store base64-encoded image
    joined_date = Column(Date, nullable=True, default=date.today)

    activities = relationship("Activity", back_populates="organizer", cascade="all, delete-orphan")
