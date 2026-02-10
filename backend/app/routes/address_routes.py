from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.address import Address

address_bp = Blueprint("addresses", __name__)

# ================= ADD ADDRESS =================
@address_bp.route("/", methods=["POST"])
def add_address():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    address = Address(
        user_id=data.get("user_id"),
        address_line=data.get("address"),
        city=data.get("city"),
        state=data.get("state"),
        pincode=data.get("pin")
    )

    db.session.add(address)
    db.session.commit()

    return jsonify({"message": "Address added successfully"}), 201


# ================= GET USER ADDRESSES =================
@address_bp.route("/<int:user_id>", methods=["GET"])
def get_addresses(user_id):
    addresses = Address.query.filter_by(user_id=user_id).all()

    data = []
    for a in addresses:
        data.append({
            "id": a.id,
            "address": a.address_line,
            "city": a.city,
            "state": a.state,
            "pin": a.pincode
        })

    return jsonify(data)
