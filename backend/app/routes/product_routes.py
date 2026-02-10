from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.product import Product

product_bp = Blueprint("products", __name__)

# ---------------- GET ALL PRODUCTS ----------------
@product_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()
    data = []

    for p in products:
        data.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "stock": p.stock,
            "image_url": p.image_url,
            "category": p.category,
            "approval_status": p.approval_status
        })

    return jsonify(data)


# ---------------- ADD PRODUCT (Supplier submits) ----------------
@product_bp.route("/", methods=["POST"])
def add_product():
    data = request.get_json()

    product = Product(
        name=data.get("name"),
        price=data.get("price"),
        description=data.get("description"),
        image_url=data.get("image_url"),
        category=data.get("category"),
        supplier_id=data.get("supplier_id"),
        stock=data.get("stock", 0),
        approval_status="Pending",
        is_active=False
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({"message": "Product submitted for approval"}), 201


# ---------------- UPDATE PRODUCT ----------------
@product_bp.route("/<int:id>", methods=["PUT"])
def update_product(id):
    data = request.get_json()

    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    product.name = data.get("name", product.name)
    product.price = data.get("price", product.price)
    product.stock = data.get("stock", product.stock)
    product.category = data.get("category", product.category)
    product.image_url = data.get("image_url", product.image_url)

    db.session.commit()

    return jsonify({"message": "Product updated successfully"})


# ---------------- DELETE PRODUCT ----------------
@product_bp.route("/<int:id>", methods=["DELETE"])
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted successfully"})
