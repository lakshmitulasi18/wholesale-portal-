import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:tulasi@localhost:5432/wholesale_portal_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = "super-secret-key"

