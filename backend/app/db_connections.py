import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="wholesale_portal",
        user="postgres",
        password="tulasi",
        port="5432"
    )
    return conn