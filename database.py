from pymongo import MongoClient
import os
import bcrypt

uri = "mongodb://admin:admin@localhost:27017?authSource=admin"


def get_db():
    try:
        client = MongoClient(uri)
        db = client.amr
        return db
    except Exception as e:
        print(f"Database connection error: {e}")
        return None


def verify_user(username, password):
    db = get_db()
    users = db.users
    user = users.find_one({"username": username})
    if user and bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return user
    return None


def create_user(username, password):
    db = get_db()
    users = db.users
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user = users.insert_one({"username": username, "password": hashed_password})
    return user


def seed_users():
    db = get_db()
    users = db.users
    if users.count_documents({}) > 0:
        return

    create_user("user@cadt", "cadt@2025")
    create_user("user@uhs", "uhs@2025")
    create_user("user@calmette", "calmette@2025")
    create_user("user@french_embassy", "fe@2025")
    create_user("user@marseille", "marseille@2025")


def create_activity(user_id, activity):
    db = get_db()
    activities = db.activities
    activity["user_id"] = user_id
    activity_id = activities.insert_one(activity)
    return activity_id
