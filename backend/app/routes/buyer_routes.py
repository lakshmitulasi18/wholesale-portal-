from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.cart import Cart

buyer_bp = Blueprint("buyer", __name__, url_prefix="/api/buyer")

# ==============================
# GET ALL PRODUCTS
# ==============================
@buyer_bp.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()

    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "price": float(p.price),
            "stock": p.stock,
            "description": p.description
        })

    return jsonify(result), 200


# ==============================
# ADD TO CART
# ==============================
@buyer_bp.route("/add-to-cart", methods=["POST"])
def add_to_cart():
    data = request.get_json()

    user_id = data.get("user_id")
    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if not user_id:
        return jsonify({"error": "user_id missing"}), 400

    product = Product.query.get(product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    cart_item = Cart(
        user_id=user_id,
        product_id=product_id,
        quantity=quantity
    )

    db.session.add(cart_item)
    db.session.commit()

    return jsonify({"message": "Added to cart"}), 201


# ==============================
# VIEW CART
# ==============================
@buyer_bp.route("/cart/<int:user_id>", methods=["GET"])
def view_cart(user_id):
    cart_items = Cart.query.filter_by(user_id=user_id).all()

    result = []
    for item in cart_items:
        product = Product.query.get(item.product_id)

        result.append({
            "cart_id": item.id,
            "product_id": item.product_id,
            "product_name": product.name,
            "price": float(product.price),
            "quantity": item.quantity
        })

    return jsonify(result), 200


# ==============================
# PLACE ORDER (FIXED VERSION)
# ==============================
@buyer_bp.route("/place-order", methods=["POST"])
def place_order():
    data = request.get_json()
    user_id = data.get("user_id")

    # 🔴 VERY IMPORTANT CHECK
    if not user_id:
        return jsonify({"error": "user_id missing"}), 400

    cart_items = Cart.query.filter_by(user_id=user_id).all()

    if not cart_items:
        return jsonify({"error": "Cart empty"}), 400

    # Create order with user_id + status
    new_order = Order(
        user_id=user_id,
        status="pending"
    )
    db.session.add(new_order)
    db.session.commit()

    # Add order items
    for item in cart_items:
        product = Product.query.get(item.product_id)

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=product.price
        )

        db.session.add(order_item)

        # Reduce stock
        product.stock -= item.quantity

        # Remove cart item
        db.session.delete(item)

    db.session.commit()

    return jsonify({"message": "Order placed successfully"}), 201


# ==============================
# VIEW BUYER ORDERS
# ==============================
@buyer_bp.route("/orders/<int:user_id>", methods=["GET"])
def get_buyer_orders(user_id):
    orders = Order.query.filter_by(user_id=user_id).all()

    result = []

    for order in orders:
        items = OrderItem.query.filter_by(order_id=order.id).all()

        order_items = []
        for item in items:
            product = Product.query.get(item.product_id)

            order_items.append({
                "product_name": product.name,
                "quantity": item.quantity,
                "price": float(item.price)
            })

        result.append({
            "order_id": order.id,
            "items": order_items
        })

    return jsonify(result), 200
