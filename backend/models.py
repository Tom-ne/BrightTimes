from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

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
    
    organizer_id = Column(Integer, ForeignKey("organizers.id"), nullable=False)
    organizer = relationship("Organizer", back_populates="activities")


class Organizer(Base):
    __tablename__ = "organizers"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    activities = relationship("Activity", back_populates="organizer", cascade="all, delete-orphan")
