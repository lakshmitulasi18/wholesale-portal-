import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone,
  Save, Edit, ArrowLeft, ShieldCheck,
  Camera, Lock
} from "lucide-react";

const API = "http://localhost:5050/api/auth/profile";

const DEFAULT_USER = {
  name: "",
  email: "",
  phone: "",
  address: "",
  businessType: "Wholesale Supplier",
  gstin: "",
  status: "Verified",
  avatar: "",
  password: "",
  bank: {
    holder: "",
    account: "",
    ifsc: "",
    bankName: ""
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(DEFAULT_USER);

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  /* ================= LOAD PROFILE FROM BACKEND ================= */
  useEffect(() => {
    const userId = sessionStorage.getItem("USER_ID");
    if (!userId) return;

    fetch(`${API}/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUserData(prev => ({
          ...prev,
          ...data,
          bank: {
            ...prev.bank,
            ...(data.bank || {})
          }
        }));
      })
      .catch(() => {
        console.log("Profile fetch failed");
      });
  }, []);

  /* ================= SAVE PROFILE TO BACKEND ================= */
  const handleSave = () => {
    const userId = sessionStorage.getItem("USER_ID");
    if (!userId) return;

    fetch(`${API}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })
      .then(res => res.json())
      .then(() => {
        setIsEditing(false);
        alert("Profile updated successfully");
      })
      .catch(() => alert("Update failed"));
  };

  const handleAvatarUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setUserData({ ...userData, avatar: reader.result });
    reader.readAsDataURL(file);
  };

  const changePassword = () => {
    if (passwords.current !== userData.password)
      return alert("Current password is incorrect");

    if (passwords.newPass !== passwords.confirm)
      return alert("Passwords do not match");

    setUserData({ ...userData, password: passwords.newPass });
    setPasswords({ current: "", newPass: "", confirm: "" });
    alert("Password updated successfully");
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <h2>Supplier Profile</h2>
        </div>

        <button
          style={isEditing ? styles.saveBtn : styles.editBtn}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing
            ? <><Save size={16}/> Save</>
            : <><Edit size={16}/> Edit</>}
        </button>
      </div>

      <div style={styles.layout}>
        {/* LEFT CARD */}
        <div style={styles.leftCard}>
          <label style={styles.avatarBox}>
            {userData.avatar
              ? <img src={userData.avatar} alt="avatar" style={styles.avatarImg} />
              : <User size={40} />}
            {isEditing && <Camera size={16} style={styles.cameraIcon} />}
            <input type="file" hidden onChange={handleAvatarUpload} />
          </label>

          <h3>{userData.name}</h3>
          <p>{userData.businessType}</p>

          <span style={styles.status}>
            <ShieldCheck size={14}/> {userData.status}
          </span>

          <p><Mail size={14}/> {userData.email}</p>
          <p><Phone size={14}/> {userData.phone}</p>
        </div>

        {/* RIGHT CARD */}
        <div style={styles.rightCard}>
          <h3>Business Details</h3>
          <div style={styles.grid}>
            <input disabled={!isEditing}
              value={userData.name}
              onChange={e => setUserData({...userData, name:e.target.value})}
              placeholder="Business Name" />

            <input disabled={!isEditing}
              value={userData.gstin}
              onChange={e => setUserData({...userData, gstin:e.target.value})}
              placeholder="GSTIN" />

            <textarea disabled={!isEditing}
              value={userData.address}
              onChange={e => setUserData({...userData, address:e.target.value})}
              placeholder="Warehouse Address" />
          </div>

          <h3>Bank Details</h3>
          <div style={styles.grid}>
            <input disabled={!isEditing}
              placeholder="Account Holder Name"
              value={userData.bank.holder}
              onChange={e => setUserData({
                ...userData,
                bank:{...userData.bank, holder:e.target.value}
              })} />

            <input disabled={!isEditing}
              placeholder="Account Number"
              value={userData.bank.account}
              onChange={e => setUserData({
                ...userData,
                bank:{...userData.bank, account:e.target.value}
              })} />

            <input disabled={!isEditing}
              placeholder="IFSC Code"
              value={userData.bank.ifsc}
              onChange={e => setUserData({
                ...userData,
                bank:{...userData.bank, ifsc:e.target.value}
              })} />

            <input disabled={!isEditing}
              placeholder="Bank Name"
              value={userData.bank.bankName}
              onChange={e => setUserData({
                ...userData,
                bank:{...userData.bank, bankName:e.target.value}
              })} />
          </div>

          <h3>Change Password</h3>
          <div style={styles.grid}>
            <input type="password" placeholder="Current Password"
              value={passwords.current}
              onChange={e => setPasswords({...passwords, current:e.target.value})} />

            <input type="password" placeholder="New Password"
              value={passwords.newPass}
              onChange={e => setPasswords({...passwords, newPass:e.target.value})} />

            <input type="password" placeholder="Confirm Password"
              value={passwords.confirm}
              onChange={e => setPasswords({...passwords, confirm:e.target.value})} />

            <button style={styles.passwordBtn} onClick={changePassword}>
              <Lock size={16}/> Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* STYLES - SAME DESIGN */
const styles = {
  container:{minHeight:"100vh",background:"#f1f5f9",padding:"30px"},
  header:{display:"flex",justifyContent:"space-between",marginBottom:"30px"},
  headerLeft:{display:"flex",alignItems:"center",gap:"10px"},
  backBtn:{border:"1px solid #e2e8f0",background:"#fff",padding:"8px",borderRadius:"8px"},
  editBtn:{border:"1px solid #0f766e",color:"#0f766e",padding:"8px 18px",borderRadius:"8px"},
  saveBtn:{background:"#0f766e",color:"#fff",padding:"8px 18px",borderRadius:"8px"},
  layout:{display:"flex",gap:"30px",flexWrap:"wrap"},
  leftCard:{width:"280px",background:"#fff",padding:"24px",borderRadius:"16px",textAlign:"center"},
  avatarBox:{width:"90px",height:"90px",borderRadius:"50%",background:"#e6fffa",
    display:"flex",alignItems:"center",justifyContent:"center",
    margin:"0 auto 15px",cursor:"pointer",position:"relative"},
  avatarImg:{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"},
  cameraIcon:{position:"absolute",bottom:"6px",right:"6px"},
  status:{display:"inline-flex",gap:"6px",background:"#dcfce7",
    color:"#166534",padding:"6px 12px",borderRadius:"20px",fontSize:"12px"},
  rightCard:{flex:1,minWidth:"400px",background:"#fff",
    padding:"24px",borderRadius:"16px"},
  grid:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"14px",marginBottom:"20px"},
  passwordBtn:{gridColumn:"1 / -1",background:"#0f766e",
    color:"#fff",padding:"10px",borderRadius:"8px"}
};

export default Profile;
