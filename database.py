import psycopg2
from psycopg2 import sql
import os
import bcrypt
import time
import logging
import json
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# PostgreSQL connection details
postgres_url = os.environ.get(
    "POSTGRES_URL", "dbname=amr_app user=postgres password=postgres host=localhost"
)
conn = None


def connect_to_db(attempts=3, delay=5):
    global conn
    for _attempt in range(attempts):
        try:
            logging.info(f"Connecting to PostgreSQL: {postgres_url}")
            conn = psycopg2.connect(postgres_url)
            return
        except psycopg2.OperationalError as e:
            print(f"PostgreSQL connection error: {e}")
            time.sleep(delay)
    conn = None


def ensure_connection():
    """Check if connection is alive and reconnect if needed"""
    global conn

    # Check if connection is None or closed
    if conn is None or conn.closed:
        connect_to_db()
        return

    # Check if connection is still active with a simple query
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            cur.fetchone()
    except (psycopg2.OperationalError, psycopg2.InterfaceError):
        # Connection lost, attempt to reconnect
        logging.info("Database connection lost. Attempting to reconnect...")
        connect_to_db()


connect_to_db()


def verify_user(username, password):
    ensure_connection()
    if conn is None:
        return None
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, username, password FROM users WHERE username = %s", (username,)
        )
        user_data = cur.fetchone()
        if user_data and bcrypt.checkpw(
            password.encode("utf-8"), user_data[2].encode("utf-8")
        ):
            return {"id": user_data[0], "username": user_data[1]}
    return None


def create_user(username, password):
    ensure_connection()
    if conn is None:
        return None
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
        "utf-8"
    )
    with conn.cursor() as cur:
        try:
            cur.execute(
                "INSERT INTO users (username, password) VALUES (%s, %s)",
                (username, hashed_password),
            )
            conn.commit()
            return {"username": username}
        except psycopg2.IntegrityError:
            conn.rollback()
            return None  # User already exists


def seed_users():
    ensure_connection()
    if conn is None:
        return
    with conn.cursor() as cur:
        users = [
            ("user@cadt", "cadt@2025"),
            ("user@uhs", "uhs@2025"),
            ("user@calmette", "calmette@2025"),
            ("user@french_embassy", "fe@2025"),
            ("user@marseille", "marseille@2025"),
        ]
        for username, password in users:
            cur.execute("SELECT 1 FROM users WHERE username = %s", (username,))
            if not cur.fetchone():
                create_user(username, password)


def seed_locations():
    ensure_connection()
    if conn is None:
        return
    with conn.cursor() as cur:
        cur.execute("SELECT 1 FROM locations LIMIT 1")
        if cur.fetchone():
            return

        locations = [
            ("Calmette Hospital", 11.581396075915201, 104.91654819669195, 1000),
            ("CADT", 11.654651435959629, 104.91148097840758, 1000),
        ]
        for name, lat, lng, allowed_distance in locations:
            cur.execute(
                "INSERT INTO locations (name, lat, lng, allowed_distance) VALUES (%s, %s, %s, %s)",
                (name, lat, lng, allowed_distance),
            )
        conn.commit()


def create_activity(user_id, activity):
    ensure_connection()
    if conn is None or user_id is None:
        logging.error("Invalid user_id or database connection is not established.")
        return None
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO activities (user_id, activity_data) VALUES (%s, %s) RETURNING id",
            (user_id, json.dumps(activity)),
        )
        conn.commit()
        return cur.fetchone()[0]


def get_locations():
    ensure_connection()
    if conn is None:
        return []
    with conn.cursor() as cur:
        cur.execute("SELECT id, name, lat, lng, allowed_distance FROM locations")
        locations = [
            {
                "_id": row[0],
                "name": row[1],
                "lat": row[2],
                "lng": row[3],
                "allowed_distance": row[4],
            }
            for row in cur.fetchall()
        ]
    return locations


def setup_table():
    ensure_connection()
    if conn is None:
        return
    with conn.cursor() as cur:
        try:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL
                );
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS locations (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    lat FLOAT NOT NULL,
                    lng FLOAT NOT NULL,
                    allowed_distance INT NOT NULL
                );
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS activities (
                    id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(id),
                    activity_data JSONB NOT NULL
                );
                """
            )
            conn.commit()
        except Exception as e:
            conn.rollback()
            logging.error(f"Error setting up tables: {e}")
