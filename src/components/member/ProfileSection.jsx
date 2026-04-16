import React, { useEffect, useState } from "react";
import { User, Mail, Shield, Camera, LockKeyhole } from "lucide-react";
import { photoService } from "../../services/photoService";
import { userService } from "../../services/userService";

const ProfileSection = ({ userProfile, onProfileUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [photoTitle, setPhotoTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [accountForm, setAccountForm] = useState({
    fullName: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [accountMessage, setAccountMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [activeAction, setActiveAction] = useState("");

  useEffect(() => {
    if (!userProfile) return;
    setAccountForm({
      fullName: userProfile.fullName || "",
      email: userProfile.email || "",
    });
  }, [userProfile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPhotoTitle("");
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    if (!photoTitle.trim()) {
      alert("Vui lòng nhập tiêu đề cho ảnh (Bắt buộc)!");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("File", selectedFile);
      formData.append("Title", photoTitle.trim());
      formData.append("Type", "1"); // Ảnh đại diện là Main
      formData.append("UserId", userProfile.userId);

      const res = await photoService.upload(formData);
      if (res) {
        alert("Cập nhật ảnh đại diện thành công!");
        cancelUpload();
        if (onProfileUpdate) onProfileUpdate(); // Tải lại profile
      }
    } catch (e) {
      alert("Lỗi tải ảnh lên: " + e.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAccountChange = (field, value) => {
    setAccountForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setAccountMessage({ type: "", text: "" });

    const fullName = accountForm.fullName.trim();
    const email = accountForm.email.trim();

    if (!fullName || !email) {
      setAccountMessage({ type: "error", text: "Vui lòng nhập đầy đủ họ tên và email." });
      return;
    }

    setIsSavingAccount(true);
    try {
      await userService.update(userProfile.userId, {
        fullName,
        email,
        role: userProfile.role,
        isActive: userProfile.isActive ?? 1,
      });
      setAccountMessage({ type: "success", text: "Cập nhật tài khoản thành công." });
      if (onProfileUpdate) await onProfileUpdate();
    } catch (e) {
      setAccountMessage({ type: "error", text: e.message || "Không thể cập nhật tài khoản." });
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    const oldPassword = passwordForm.oldPassword.trim();
    const newPassword = passwordForm.newPassword.trim();
    const confirmPassword = passwordForm.confirmPassword.trim();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin mật khẩu." });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Xác nhận mật khẩu mới không khớp." });
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword(userProfile.userId, {
        oldPassword,
        newPassword,
      });
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordMessage({ type: "success", text: "Đổi mật khẩu thành công." });
    } catch (e) {
      setPasswordMessage({ type: "error", text: e.message || "Không thể đổi mật khẩu." });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: 14,
    color: "#0f172a",
    background: "#fff",
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 700,
    color: "#475569",
    marginBottom: 6,
    display: "block",
  };

  const submitButtonStyle = (disabled, color) => ({
    padding: "12px 16px",
    background: disabled ? "#94a3b8" : color,
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const renderMessage = (message) =>
    message.text ? (
      <div
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          background: message.type === "success" ? "#ecfdf5" : "#fef2f2",
          color: message.type === "success" ? "#047857" : "#b91c1c",
          border: `1px solid ${message.type === "success" ? "#a7f3d0" : "#fecaca"}`,
        }}
      >
        {message.text}
      </div>
    ) : null;

  const actionButtonStyle = (isActive) => ({
    flex: "1 1 220px",
    padding: "16px 18px",
    borderRadius: 14,
    border: isActive ? "1px solid #2563eb" : "1px solid #cbd5e1",
    background: isActive ? "#eff6ff" : "#fff",
    color: "#0f172a",
    cursor: "pointer",
    textAlign: "left",
    transition: "0.2s",
  });

  if (!userProfile) return <div>Đang tải...</div>;

  return (
    <div style={{ display: "flex", gap: 30, flexWrap: "wrap", alignItems: "flex-start" }}>
      {/* KHUNG AVATAR */}
      <div style={{ flex: "1 1 300px", background: "#fff", padding: 30, borderRadius: 16, border: "1px solid #e2e8f0", textAlign: "center" }}>
        <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 20px" }}>
          <img 
            src={previewUrl || userProfile.photoUrl || `https://ui-avatars.com/api/?name=${userProfile.fullName}&background=6366f1&color=fff`} 
            alt="avatar" 
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "4px solid #eff6ff" }} 
          />
          <label style={{ position: "absolute", bottom: 4, right: 4, background: "#3b82f6", color: "#fff", padding: 10, borderRadius: "50%", cursor: "pointer", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }}>
            <Camera size={18} />
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          </label>
        </div>

        {selectedFile && (
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: 12, border: "1px dashed #cbd5e1", marginTop: 16 }}>
            <div style={{ marginBottom: 12, textAlign: "left" }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 6, display: "block" }}>Tiêu đề ảnh (Bắt buộc) <span style={{color:"red"}}>*</span></label>
              <input 
                type="text" 
                placeholder="VD: Avatar tháng 4" 
                value={photoTitle}
                onChange={e => setPhotoTitle(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={cancelUpload} style={{ flex: 1, padding: "10px", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 8, color: "#475569", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
              <button onClick={handleUploadPhoto} disabled={isUploading} style={{ flex: 1, padding: "10px", background: "#10b981", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: isUploading ? "not-allowed" : "pointer" }}>
                {isUploading ? "Đang tải..." : "Lưu ảnh"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* KHUNG THÔNG TIN */}
      <div style={{ flex: "2 1 400px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ background: "#fff", padding: 30, borderRadius: 16, border: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: "0 0 20px", color: "#0f172a", fontSize: 20 }}>Thông tin cá nhân</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ background: "#eff6ff", padding: 12, borderRadius: 12, color: "#3b82f6" }}><User size={20}/></div>
            <div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>Họ và tên</div><div style={{ fontSize: 16, color: "#0f172a", fontWeight: 700 }}>{userProfile.fullName}</div></div>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ background: "#eff6ff", padding: 12, borderRadius: 12, color: "#3b82f6" }}><Mail size={20}/></div>
            <div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>Email đăng nhập</div><div style={{ fontSize: 16, color: "#0f172a", fontWeight: 700 }}>{userProfile.email}</div></div>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ background: "#eff6ff", padding: 12, borderRadius: 12, color: "#3b82f6" }}><Shield size={20}/></div>
            <div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>Vai trò trong hệ thống</div><div style={{ fontSize: 16, color: "#0f172a", fontWeight: 700, textTransform: "capitalize" }}>{userProfile.role}</div></div>
          </div>
        </div>
      </div>

        <div style={{ background: "#fff", padding: 30, borderRadius: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 20px", color: "#0f172a", fontSize: 20 }}>Thiết lập tài khoản</h3>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setActiveAction(activeAction === "account" ? "" : "account")} style={actionButtonStyle(activeAction === "account")}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ background: "#eff6ff", padding: 10, borderRadius: 12, color: "#2563eb" }}>
                  <User size={18} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Cập nhật tài khoản</div>
              </div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Sửa họ tên và email đăng nhập.</div>
            </button>

            <button type="button" onClick={() => setActiveAction(activeAction === "password" ? "" : "password")} style={actionButtonStyle(activeAction === "password")}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ background: "#eff6ff", padding: 10, borderRadius: 12, color: "#2563eb" }}>
                  <LockKeyhole size={18} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Đổi mật khẩu</div>
              </div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Thay đổi mật khẩu tài khoản hiện tại.</div>
            </button>
          </div>

          {activeAction === "account" && (
            <form onSubmit={handleUpdateAccount} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
              <div>
                <label style={labelStyle}>Họ và tên</label>
                <input
                  type="text"
                  value={accountForm.fullName}
                  onChange={(e) => handleAccountChange("fullName", e.target.value)}
                  style={inputStyle}
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label style={labelStyle}>Email đăng nhập</label>
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) => handleAccountChange("email", e.target.value)}
                  style={inputStyle}
                  placeholder="Nhập email"
                />
              </div>

              {renderMessage(accountMessage)}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" disabled={isSavingAccount} style={submitButtonStyle(isSavingAccount, "#2563eb")}>
                  {isSavingAccount ? "Đang cập nhật..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          )}

          {activeAction === "password" && (
            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
              <div>
                <label style={labelStyle}>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                  style={inputStyle}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div>
                <label style={labelStyle}>Mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  style={inputStyle}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div>
                <label style={labelStyle}>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  style={inputStyle}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              {renderMessage(passwordMessage)}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" disabled={isChangingPassword} style={submitButtonStyle(isChangingPassword, "#0f766e")}>
                  {isChangingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
