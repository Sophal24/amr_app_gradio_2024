from pymongo import MongoClient, errors
import os
import bcrypt
import time
import logging

uri = os.environ.get("MONGODB_URI","mongodb://admin:admin@localhost:27017?authSource=admin")

client = None
db = None

def connect_to_db(attempts=3, delay=5):
    global client, db
    for attempt in range(attempts):
        try:
            logging.info(f"Connecting to database: {uri}")
            client = MongoClient(uri)
            db = client.amr
            return
        except errors.ConnectionFailure as e:
            print(f"Database connection error: {e}")
            time.sleep(delay)
        except errors.OperationFailure as e:
            print(f"Authentication error: {e}")
            time.sleep(delay)
    client = None
    db = None

connect_to_db()

def verify_user(username, password):
    if client is None:
        return None
    users = db.users
    user = users.find_one({"username": username})
    if user and bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return user
    return None

def create_user(username, password):
    if client is None:
        return None
    users = db.users
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user = users.insert_one({"username": username, "password": hashed_password})
    return user

def seed_users():
    if client is None:
        return
    users = db.users
    if users.count_documents({}) > 0:
        return

    create_user("user@cadt", "cadt@2025")
    create_user("user@uhs", "uhs@2025")
    create_user("user@calmette", "calmette@2025")
    create_user("user@french_embassy", "fe@2025")
    create_user("user@marseille", "marseille@2025")

def seed_locations():
    if client is None:
        return
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
    if client is None:
        return None
    activities = db.activities
    activity["user_id"] = user_id
    activity_id = activities.insert_one(activity)
    return activity_id

def get_locations():
    if client is None:
        return []
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
