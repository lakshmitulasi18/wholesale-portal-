from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.cart import Cart

cart_bp = Blueprint("cart", __name__)

@cart_bp.route("/", methods=["POST"])
def add_to_cart():
    data = request.get_json()

    cart_item = Cart(
        user_id=data.get("user_id"),
        product_id=data.get("product_id"),
        quantity=data.get("quantity")
    )

    db.session.add(cart_item)
    db.session.commit()

    return jsonify({"message": "Added to cart"}), 201