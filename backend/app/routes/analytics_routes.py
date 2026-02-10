from flask import Blueprint, jsonify
from app.extensions import db

analytics_bp = Blueprint("analytics", __name__)

@analytics_bp.route("/", methods=["GET"])
def get_analytics():
    users = db.session.execute("SELECT COUNT(*) FROM users").scalar()
    orders = db.session.execute("SELECT COUNT(*) FROM orders").scalar()
    disputes = db.session.execute("SELECT COUNT(*) FROM order_disputes").scalar()

    return jsonify({
        "users": users,
        "orders": orders,
        "disputes": disputes
    })
