from app.extensions import db
from datetime import datetime

class OrderDispute(db.Model):
    __tablename__ = "order_disputes"

    id = db.Column(db.Integer, primary_key=True)
    dispute_id = db.Column(db.String(20), unique=True, nullable=False)
    order_id = db.Column(db.String(20), nullable=False)
    buyer = db.Column(db.String(120))
    supplier = db.Column(db.String(120))
    issue = db.Column(db.Text)
    amount = db.Column(db.Numeric(10,2))
    status = db.Column(db.String(20), default="Open")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
