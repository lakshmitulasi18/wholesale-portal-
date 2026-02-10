from app.extensions import db

class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer)
    product_id = db.Column(db.Integer)
    qty = db.Column(db.Integer)
    price = db.Column(db.Numeric(10,2))
