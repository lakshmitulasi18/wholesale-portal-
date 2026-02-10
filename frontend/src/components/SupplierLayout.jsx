const SupplierLayout = ({ children, fullScreen = false }) => {
  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>

      {/* SHOW SIDEBAR ONLY IF NOT FULL SCREEN */}
      {!fullScreen && (
        <aside style={{ width: 240 }}>
          {/* Sidebar content */}
        </aside>
      )}

      {/* MAIN CONTENT */}
      <main style={{ width: "100%" }}>
        {children}
      </main>

    </div>
  );
};

export default SupplierLayout;
