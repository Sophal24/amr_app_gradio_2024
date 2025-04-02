import redis
import os
import bcrypt
import time
import logging
import json

redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379")
redis_client = None

def connect_to_db(attempts=3, delay=5):
    global redis_client
    for _attempt in range(attempts):
        try:
            logging.info(f"Connecting to Redis: {redis_url}")
            redis_client = redis.StrictRedis.from_url(redis_url, decode_responses=True)
            redis_client.ping()  # Test connection
            return
        except redis.ConnectionError as e:
            print(f"Redis connection error: {e}")
            time.sleep(delay)
    redis_client = None

connect_to_db()

def verify_user(username, password):
    if redis_client is None:
        return None
    user_data = redis_client.hgetall(f"user:{username}")
    if user_data and bcrypt.checkpw(password.encode("utf-8"), user_data["password"].encode("utf-8")):
        return user_data
    return None

def create_user(username, password):
    if redis_client is None:
        return None
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user_key = f"user:{username}"
    if redis_client.exists(user_key):
        return None  # User already exists
    redis_client.hset(user_key, mapping={"username": username, "password": hashed_password})
    return {"username": username}

def seed_users():
    if redis_client is None:
        return
    if redis_client.keys("user:*"):
        return

    create_user("user@cadt", "cadt@2025")
    create_user("user@uhs", "uhs@2025")
    create_user("user@calmette", "calmette@2025")
    create_user("user@french_embassy", "fe@2025")
    create_user("user@marseille", "marseille@2025")

def seed_locations():
    if redis_client is None:
        return
    if redis_client.keys("location:*"):
        return

    redis_client.set(
        "location:Calmette Hospital",
        json.dumps(
            {
                "name": "Calmette Hospital",
                "lat": 11.581396075915201,
                "lng": 104.91654819669195,
                "allowed_distance": 1000,
            }
        ),
    )
    redis_client.set(
        "location:CADT",
        json.dumps(
            {
                "name": "CADT",
                "lat": 11.654651435959629,
                "lng": 104.91148097840758,
                "allowed_distance": 1000,
            }
        ),
    )

def create_activity(user_id, activity):
    if redis_client is None:
        return None
    activity_id = redis_client.incr("activity:id")
    activity_key = f"activity:{activity_id}"
    activity["user_id"] = user_id
    redis_client.set(activity_key, json.dumps(activity))
    return activity_id

def get_locations():
    if redis_client is None:
        return []
    locations = []
    for key in redis_client.keys("location:*"):
        location = json.loads(redis_client.get(key))
        location["_id"] = key.split(":")[1]
        locations.append(location)
    return locations
