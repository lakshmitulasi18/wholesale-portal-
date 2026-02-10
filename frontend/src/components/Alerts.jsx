const Alerts = ({ type = "info", message }) => {
  if (!message) return null;

  const styles = {
    success: { background: "#dcfce7", color: "#166534" },
    error: { background: "#fee2e2", color: "#991b1b" },
    warning: { background: "#fef9c3", color: "#854d0e" },
    info: { background: "#e0f2fe", color: "#075985" }
  };

  return (
    <div style={{
      padding: "12px 18px",
      borderRadius: "10px",
      marginBottom: "15px",
      ...styles[type]
    }}>
      {message}
    </div>
  );
};

export default Alerts;
