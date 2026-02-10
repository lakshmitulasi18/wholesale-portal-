from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
import random

auth_bp = Blueprint("auth", __name__)

# ================= REGISTER =================
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ["name", "email", "phone", "password", "role"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400

        # Check if user already exists
        existing_user = User.query.filter_by(email=data["email"]).first()
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409

        # Hash password
        hashed_pw = generate_password_hash(data["password"])

        # Supplier company name
        company_name = data.get("company_name") if data["role"] == "supplier" else None

        user = User(
            name=data["name"],
            email=data["email"],
            phone=data["phone"],
            password=hashed_pw,
            role=data["role"],
            company_name=company_name,
            is_active=False if data["role"] == "supplier" else True,
            reset_code=None
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= LOGIN =================
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        if not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid password"}), 401

        # Supplier approval check
        if user.role == "supplier" and not user.is_active:
            return jsonify({"error": "Supplier not approved yet"}), 403

        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= FORGOT PASSWORD =================
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"error": "Email required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        reset_code = str(random.randint(100000, 999999))
        user.reset_code = reset_code
        db.session.commit()

        return jsonify({
            "message": "Reset code generated",
            "reset_code": reset_code
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= RESET PASSWORD =================
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()

        email = data.get("email")
        code = data.get("code")
        new_password = data.get("new_password")

        if not email or not code or not new_password:
            return jsonify({"error": "Email, code, and new password required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        if str(user.reset_code) != str(code):
            return jsonify({"error": "Invalid reset code"}), 401

        user.password = generate_password_hash(new_password)
        user.reset_code = None
        db.session.commit()

        return jsonify({"message": "Password reset successful"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= GET PROFILE =================
@auth_bp.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "address": user.address,
        "gstin": user.gstin
    })


# ================= UPDATE PROFILE =================
@auth_bp.route("/profile/<int:user_id>", methods=["PUT"])
def update_profile(user_id):
    data = request.get_json()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user.name = data.get("name", user.name)
    user.phone = data.get("phone", user.phone)
    user.address = data.get("address", user.address)
    user.gstin = data.get("gstin", user.gstin)

    db.session.commit()

    return jsonify({"message": "Profile updated"})
