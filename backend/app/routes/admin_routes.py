from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models.user import User

admin_bp = Blueprint("admin", __name__)

# ================= GET ALL USERS =================
@admin_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    data = []

    for u in users:
        data.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "status": "Active" if u.is_active else "Blocked"
        })

    return jsonify(data)


# ================= GET ALL SUPPLIERS =================
@admin_bp.route("/suppliers", methods=["GET"])
def get_suppliers():
    suppliers = User.query.filter_by(role="supplier").all()

    data = []
    for s in suppliers:
        data.append({
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "company_name": s.company_name,
            "status": "Active" if s.is_active else "Blocked",
            "verified": "Yes" if s.is_verified else "No"
        })

    return jsonify(data)


# ================= BLOCK / UNBLOCK USER =================
@admin_bp.route("/toggle-user-status/<int:user_id>", methods=["PUT"])
def toggle_user_status(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user.is_active = not user.is_active
    db.session.commit()

    return jsonify({"message": "User status updated"})


# ================= DELETE USER =================
@admin_bp.route("/delete-user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted"})


# ================= ADD USER =================
@admin_bp.route("/add-user", methods=["POST"])
def add_user():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    role = data.get("role")

    if not name or not email:
        return jsonify({"error": "Name & Email required"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(
        name=name,
        email=email,
        phone="",
        password="123456",
        role=role,
        company_name=None,
        is_active=True,
        is_verified=False
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User added successfully"})


# ================= APPROVE SUPPLIER =================
@admin_bp.route("/suppliers/approve/<int:id>", methods=["PUT"])
def approve_supplier(id):
    supplier = User.query.get(id)

    if not supplier:
        return jsonify({"error": "Supplier not found"}), 404

    supplier.is_verified = True
    supplier.is_active = True
    db.session.commit()

    return jsonify({"message": "Supplier approved"})


# ================= REJECT SUPPLIER =================
@admin_bp.route("/suppliers/reject/<int:id>", methods=["PUT"])
def reject_supplier(id):
    supplier = User.query.get(id)

    if not supplier:
        return jsonify({"error": "Supplier not found"}), 404

    supplier.is_verified = False
    supplier.is_active = False
    db.session.commit()

    return jsonify({"message": "Supplier rejected"})
