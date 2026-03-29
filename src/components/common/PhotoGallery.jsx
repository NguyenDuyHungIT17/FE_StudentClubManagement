import React, { useState, useEffect } from "react";
import { photoService } from "../../services/photoService";
import { Upload, Trash2, Image as ImageIcon, Edit, X } from "lucide-react";

const PhotoGallery = ({ entityType, entityId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // States cho Form Thêm/Sửa
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("1"); // 1: Main, 2: Cover, 3: Side

  useEffect(() => {
    if (entityId) fetchPhotos();
  }, [entityId, entityType]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      let res;
      if (entityType === "club") res = await photoService.getByClub(entityId);
      else if (entityType === "event") res = await photoService.getByEvent(entityId);
      else if (entityType === "user") res = await photoService.getByUser(entityId);
        else if (entityType === "clubMember") res = await photoService.getByClubMember(entityId);
      const photoData = res?.value || res?.data || res || [];
      setPhotos(Array.isArray(photoData) ? photoData : []);
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingPhotoId(null);
    setFile(null);
    setTitle("");
    setType("1");
    // Reset file input UI
    const fileInput = document.getElementById("photo-upload-input");
    if (fileInput) fileInput.value = "";
  };

  const handleEditClick = (photo) => {
    setEditingPhotoId(photo.photoId || photo.id);
    setTitle(photo.title || "");
    setType((photo.type || 1).toString());
    setFile(null); // Không bắt buộc chọn lại file khi update
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingPhotoId && !file) return alert("Vui lòng chọn file ảnh để tải lên!");
    if (!title.trim()) return alert("Vui lòng nhập tiêu đề ảnh!");

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (file) formData.append("File", file); // Nếu update không chọn file mới thì bỏ qua
      formData.append("Title", title);
      formData.append("Type", type);

      if (editingPhotoId) {
        // CẬP NHẬT ẢNH (PUT)
        await photoService.update(editingPhotoId, formData);
        alert("Cập nhật ảnh thành công!");
      } else {
        // THÊM MỚI ẢNH (POST)
        if (entityType === "club") formData.append("ClubId", entityId);
        else if (entityType === "event") formData.append("EventId", entityId);
        else if (entityType === "user") formData.append("UserId", entityId);
        else if (entityType === "clubMember") formData.append("ClubMemberId", entityId);
        await photoService.upload(formData);
        alert("Tải ảnh lên thành công!");
      }
      
      resetForm();
      await fetchPhotos();
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này vĩnh viễn?")) return;
    try {
      await photoService.delete(photoId);
      setPhotos(photos.filter(p => (p.photoId || p.id) !== photoId));
    } catch (error) {
      alert("Xóa thất bại: " + error.message);
    }
  };

  const getTypeLabel = (typeId) => {
    if (typeId === 1 || typeId === "1") return "Main";
    if (typeId === 2 || typeId === "2") return "Cover";
    if (typeId === 3 || typeId === "3") return "Side";
    return "Other";
  };

  return (
    <div style={{ marginTop: "24px", borderTop: "2px dashed #e2e8f0", paddingTop: "20px" }}>
      <h5 style={{ fontWeight: "700", color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}>
        <ImageIcon size={18} color="var(--primary)" /> Quản lý Hình ảnh đính kèm
      </h5>

      {/* FORM THÊM / SỬA */}
      <form onSubmit={handleSubmit} style={{ background: editingPhotoId ? "#fffbeb" : "#f8fafc", padding: "16px", borderRadius: "12px", border: `1px solid ${editingPhotoId ? "#fde68a" : "#cbd5e1"}`, marginBottom: "20px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: "1 1 180px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px", display: "block", color: "#334155" }}>
            {editingPhotoId ? "Đổi Ảnh mới (Bỏ qua nếu giữ nguyên)" : "Chọn Ảnh *"}
          </label>
          <input id="photo-upload-input" type="file" accept="image/*" className="input-control" style={{ padding: "8px", background: "#fff" }} onChange={e => setFile(e.target.files[0])} />
        </div>
        <div style={{ flex: "1 1 150px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px", display: "block", color: "#334155" }}>Tiêu đề <span style={{color:"red"}}>*</span></label>
          <input type="text" className="input-control" placeholder="VD: Logo, Ảnh bìa..." value={title} onChange={e => setTitle(e.target.value)} style={{ margin: 0, background: "#fff" }} />
        </div>
        <div style={{ flex: "0 0 120px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px", display: "block", color: "#334155" }}>Loại ảnh</label>
          <select className="input-control" value={type} onChange={e => setType(e.target.value)} style={{ margin: 0, background: "#fff" }}>
            <option value="1">Main (Chính)</option>
            <option value="2">Cover (Bìa)</option>
            <option value="3">Side (Phụ)</option>
          </select>
        </div>
        
        <div style={{ display: "flex", gap: "8px" }}>
          {editingPhotoId && (
            <button type="button" className="btn" style={{ height: "42px", background: "#f1f5f9", color: "#475569", fontWeight: "600" }} onClick={resetForm}>
              <X size={16} /> Hủy
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ height: "42px", background: editingPhotoId ? "#f59e0b" : "" }}>
            <Upload size={16} /> {submitting ? "Đang xử lý..." : (editingPhotoId ? "Lưu Cập nhật" : "Tải lên")}
          </button>
        </div>
      </form>

      {/* LƯỚI HIỂN THỊ ẢNH */}
      {loading ? (
        <div style={{ fontSize: "13px", color: "#64748b", padding: "20px", textAlign: "center" }}>Đang tải thư viện ảnh...</div>
      ) : photos.length === 0 ? (
        <div style={{ fontSize: "13px", color: "#64748b", fontStyle: "italic", textAlign: "center", padding: "30px", background: "#f1f5f9", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>Thực thể này chưa có hình ảnh đính kèm nào.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
          {photos.map(photo => {
            const pid = photo.photoId || photo.id;
            return (
              <div key={pid} style={{ border: editingPhotoId === pid ? "2px solid #f59e0b" : "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", position: "relative", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                <img src={photo.url} alt={photo.title} style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} />
                <div style={{ padding: "10px", background: "#fff", borderTop: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{photo.title}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px", fontWeight: "600" }}>
                    <span style={{ display: "inline-block", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>{getTypeLabel(photo.type)}</span>
                  </div>
                </div>
                
                {/* Nút Xóa & Sửa nổi lên trên ảnh */}
                <div style={{ position: "absolute", top: "6px", right: "6px", display: "flex", gap: "4px" }}>
                  <button onClick={() => handleEditClick(photo)} style={{ background: "#fff", color: "#f59e0b", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", display: "flex", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} title="Sửa ảnh">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(pid)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", display: "flex", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} title="Xóa ảnh">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;