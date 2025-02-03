from pymongo import MongoClient
import os
import bcrypt

uri = "mongodb://admin:admin@mongo:27017?authSource=admin"
# uri = "mongodb://admin:admin@localhost:27017?authSource=admin"


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


def seed_locations():
    db = get_db()
    locations = db.locations
    if locations.count_documents({}) > 0:
        return

    locations.insert_one(
        {
            "name": "Calmette Hospital",
            "lat": 11.581396075915201,
            "lng": 104.91654819669195,
            "allowed_distance": 1000,
        }
    )
    locations.insert_one(
        {
            "name": "CADT",
            "lat": 11.654651435959629,
            "lng": 104.91148097840758,
            "allowed_distance": 1000,
        }
    )


def create_activity(user_id, activity):
    db = get_db()
    activities = db.activities
    activity["user_id"] = user_id
    activity_id = activities.insert_one(activity)
    return activity_id


def get_locations():
    db = get_db()
    locations = []
    for location in db.locations.find({}):
        locations.append(
            {
                "name": location.get("name"),
                "lat": location.get("lat"),
                "lng": location.get("lng"),
                "allowed_distance": location.get("allowed_distance"),
                "_id": location.get("_id").__str__(),
            }
        )
    return locations
