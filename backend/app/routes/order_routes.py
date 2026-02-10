from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product

order_bp = Blueprint("orders", __name__)

# ================= PLACE ORDER =================
@order_bp.route("/", methods=["POST"])
def create_order():
    try:
        data = request.get_json()
        print("ORDER DATA RECEIVED:", data)

        if not data:
            return jsonify({"error": "No data received"}), 400

        user_id = data.get("user_id")
        total_amount = data.get("total_amount")
        items = data.get("items", [])

        # 🛑 Safety checks
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        if not total_amount:
            return jsonify({"error": "total_amount is required"}), 400

        if not items or len(items) == 0:
            return jsonify({"error": "Cart is empty"}), 400

        # 🔥 Create Order
        new_order = Order(
            user_id=user_id,
            total_amount=total_amount,
            status="pending"
        )
        db.session.add(new_order)
        db.session.commit()

        # 🔥 Save Order Items
        for item in items:
            product_id = item.get("id") or item.get("product_id")
            qty = item.get("qty") or item.get("quantity")
            price = item.get("price")

            if not product_id or not qty or not price:
                continue  # skip bad items safely

            order_item = OrderItem(
                order_id=new_order.id,
                product_id=product_id,
                qty=qty,
                price=price
            )
            db.session.add(order_item)

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Order placed successfully",
            "order_id": new_order.id
        }), 201

    except Exception as e:
        db.session.rollback()
        print("ORDER ERROR:", str(e))
        return jsonify({"error": "Server error placing order"}), 500


# ================= GET USER ORDERS =================
@order_bp.route("/<int:user_id>", methods=["GET"])
def get_orders(user_id):
    try:
        orders = Order.query.filter_by(user_id=user_id).all()
        result = []

        for order in orders:
            items = OrderItem.query.filter_by(order_id=order.id).all()
            products = []

            for item in items:
                product = Product.query.get(item.product_id)
                products.append({
                    "name": product.name if product else "Unknown",
                    "price": float(item.price),
                    "qty": item.qty,
                    "image_url": product.image_url if product else ""
                })

            result.append({
                "order_id": order.id,
                "total": float(order.total_amount),
                "status": order.status,
                "items": products
            })

        return jsonify(result)

    except Exception as e:
        print("GET ORDERS ERROR:", str(e))
        return jsonify({"error": "Server error fetching orders"}), 500