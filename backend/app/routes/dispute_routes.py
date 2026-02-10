from flask import Blueprint, jsonify
from app.models.dispute import Dispute

dispute_bp = Blueprint("disputes", __name__)

@dispute_bp.route("/", methods=["GET"])
def get_disputes():
    disputes = Dispute.query.all()

    data = []
    for d in disputes:
        data.append({
            "id": d.id,
            "orderId": d.order_id,
            "buyer": d.buyer_name,
            "supplier": d.supplier_name,
            "issue": d.issue,
            "amount": d.amount,
            "status": d.status,
            "date": d.date
        })

    return jsonify(data)
