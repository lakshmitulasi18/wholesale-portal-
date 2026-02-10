from flask import Flask
from .extensions import db
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # PostgreSQL connection
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:tulasi@localhost:5432/wholesale_portal_db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize DB
    db.init_app(app)

    # Allow frontend (React)
    CORS(app)

    # ================= AUTH ROUTES =================
    from .routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # ================= PRODUCT ROUTES =================
    from .routes.product_routes import product_bp
    app.register_blueprint(product_bp, url_prefix="/api/products")

    # ================= ADMIN PRODUCT APPROVAL ROUTES =================
    from .routes.admin_product_routes import admin_product_bp
    app.register_blueprint(admin_product_bp, url_prefix="/api/admin/products")

    # ================= ORDER ROUTES =================
    from .routes.order_routes import order_bp
    app.register_blueprint(order_bp, url_prefix="/api/orders")

    # ================= BUYER ROUTES =================
    from .routes.buyer_routes import buyer_bp
    app.register_blueprint(buyer_bp, url_prefix="/api/buyer")

    # ================= ADMIN USER ROUTES =================
    from .routes.admin_routes import admin_bp
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    # ================= DISPUTE ROUTES =================
    from .routes.dispute_routes import dispute_bp
    app.register_blueprint(dispute_bp, url_prefix="/api/disputes")

    # ================= ANALYTICS ROUTES =================
    from .routes.analytics_routes import analytics_bp
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")

    # ================= ADDRESS ROUTES =================
    from .routes.address_routes import address_bp
    app.register_blueprint(address_bp, url_prefix="/api/addresses")

    # Test route
    @app.route("/")
    def home():
        return "Backend Running 🚀"

    return app
