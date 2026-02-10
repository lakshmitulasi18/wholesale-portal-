import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="wholesale_portal_db",
        user="postgres",
        password="tulasi"
    )
    return conn