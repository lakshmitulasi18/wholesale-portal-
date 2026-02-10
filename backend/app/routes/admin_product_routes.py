from flask import Blueprint, jsonify
from app.extensions import db
from app.models.product import Product

admin_product_bp = Blueprint("admin_products", __name__)

# GET ALL PRODUCTS FOR ADMIN
@admin_product_bp.route("/", methods=["GET"])
def get_all_products_admin():
    products = Product.query.all()
    data = []

    for p in products:
        data.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "image_url": p.image_url,
            "category": p.category,
            "supplier": p.supplier.company_name if p.supplier else "Unknown",
            "status": p.approval_status,
            "stock": p.stock,
            "rating": p.rating,
            "date": p.created_at.strftime("%d %b %Y")
        })

    return jsonify(data)


# APPROVE PRODUCT
@admin_product_bp.route("/approve/<int:id>", methods=["PUT"])
def approve_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    product.approval_status = "Approved"
    product.is_active = True
    db.session.commit()
    return jsonify({"message": "Product approved"})


# REJECT PRODUCT
@admin_product_bp.route("/reject/<int:id>", methods=["PUT"])
def reject_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    product.approval_status = "Rejected"
    product.is_active = False
    db.session.commit()
    return jsonify({"message": "Product rejected"})