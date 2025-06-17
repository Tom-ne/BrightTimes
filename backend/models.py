from sqlalchemy import Column, Integer, String, Date
from db import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    age_group = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    time = Column(String, nullable=False)
    join_link = Column(String, nullable=False)
    organizer = Column(String, nullable=False)
