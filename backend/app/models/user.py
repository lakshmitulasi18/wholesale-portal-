from app.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    phone = db.Column(db.String(20))
    password = db.Column(db.String(200))
    role = db.Column(db.String(20))
    company_name = db.Column(db.String(150))

    # ⭐ ADD THESE TWO
    address = db.Column(db.String(250))
    gstin = db.Column(db.String(50))

    otp = db.Column(db.String(6))
    otp_expiry = db.Column(db.String(50))

    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
