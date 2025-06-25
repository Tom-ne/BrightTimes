from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from db import Base
from datetime import date
from sqlalchemy.ext.declarative import declared_attr

class SerializableMixin:
    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()
    
    def as_dict(self, include_relationships=False):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        if include_relationships:
            for attr in self.__mapper__.relationships.keys():
                related = getattr(self, attr)
                if related is None:
                    data[attr] = None
                elif isinstance(related, list):
                    data[attr] = [item.as_dict() for item in related]
                else:
                    data[attr] = related.as_dict()
        return data

class Activity(Base, SerializableMixin):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    age_group = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    time = Column(String, nullable=False)
    join_link = Column(String, nullable=False)
    duration = Column(Integer, nullable=False) # saved in hours:minutes
    
    total_times_join_pressed = Column(Integer, default=0)
    
    organizer_id = Column(Integer, ForeignKey("organizers.id"), nullable=False)
    organizer = relationship("Organizer", back_populates="activities")

    def as_dict(self, include_relationships=False):
        data = super().as_dict(include_relationships)
        if 'password_hash' in data['organizer']:
            del data['organizer']['password_hash']
        return data


class Organizer(Base, SerializableMixin):
    __tablename__ = "organizers"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    avatar_base64 = Column(Text, nullable=True)  # Store base64-encoded image
    joined_date = Column(Date, nullable=True, default=date.today)

    activities = relationship("Activity", back_populates="organizer", cascade="all, delete-orphan")
