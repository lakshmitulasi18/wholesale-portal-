const Footer = () => {
  return (
    <footer style={{
      textAlign: "center",
      padding: "15px",
      background: "#f1f5f9",
      marginTop: "40px",
      fontSize: "14px"
    }}>
      © {new Date().getFullYear()} Wholesale Order Processing & Supplier Portal
    </footer>
  );
};

export default Footer;
