from app.extensions import db

class Address(db.Model):
    __tablename__ = "addresses"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100))
    phone = db.Column(db.String(15))
    pincode = db.Column(db.String(10))
    state = db.Column(db.String(50))
    city = db.Column(db.String(50))
    area = db.Column(db.String(100))
    house_no = db.Column(db.String(100))
