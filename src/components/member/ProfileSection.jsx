import React, { useState } from "react";
import { User, Mail, Shield, Camera, X } from "lucide-react";
import { photoService } from "../../services/photoService";

const ProfileSection = ({ userProfile, onProfileUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [photoTitle, setPhotoTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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
      <div style={{ flex: "2 1 400px", background: "#fff", padding: 30, borderRadius: 16, border: "1px solid #e2e8f0" }}>
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
    </div>
  );
};

export default ProfileSection;