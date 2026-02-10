from app.extensions import db

class Dispute(db.Model):
    __tablename__ = "disputes"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(50))
    buyer_name = db.Column(db.String(100))
    supplier_name = db.Column(db.String(100))
    issue = db.Column(db.String(200))
    amount = db.Column(db.Float)
    status = db.Column(db.String(20))
    date = db.Column(db.String(50))
