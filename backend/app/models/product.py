from app.extensions import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = "products"

    # ---------------- BASIC INFO ----------------
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100))
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))

    # ---------------- SUPPLIER LINK ----------------
    supplier_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    supplier = db.relationship("User", backref="products")

    # ---------------- ADMIN APPROVAL SYSTEM ----------------
    approval_status = db.Column(db.String(20), default="Pending")  
    # Possible values: Pending / Approved / Rejected

    is_active = db.Column(db.Boolean, default=False)  
    # Product visible to buyers only if approved

    # ---------------- EXTRA DETAILS ----------------
    rating = db.Column(db.Float, default=0)
    stock = db.Column(db.Integer, default=0)

    # ---------------- DATE ADDED ----------------
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ---------------- HELPER METHOD (Optional) ----------------
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "category": self.category,
            "description": self.description,
            "image_url": self.image_url,
            "supplier_id": self.supplier_id,
            "supplier_name": self.supplier.company_name if self.supplier else None,
            "approval_status": self.approval_status,
            "is_active": self.is_active,
            "rating": self.rating,
            "stock": self.stock,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }