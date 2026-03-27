import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import { UNI_BLUE } from "./PublicHeader";

const PublicFooter = () => (
  <footer style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "60px 0 20px", marginTop: "40px" }}>
    <div className="portal-container">
      <div className="portal-row">
        <div className="portal-col-8">
          <h5 style={{ fontWeight: "800", marginBottom: "20px", fontSize: "18px", color: UNI_BLUE }}>HỆ THỐNG QUẢN LÝ CÂU LẠC BỘ</h5>
          <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#64748b", maxWidth: "500px" }}>
            Cổng thông tin chính thức hỗ trợ sinh viên trường Đại học Công nghiệp Hà Nội trong việc đăng ký tham gia, theo dõi sự kiện và phát triển các hoạt động ngoại khóa.
          </p>
        </div>
        <div className="portal-col-4">
          <h5 style={{ fontWeight: "700", marginBottom: "20px", fontSize: "16px", color: "#334155" }}>THÔNG TIN LIÊN HỆ</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}><MapPin size={16} color={UNI_BLUE}/> 298 Cầu Diễn, Bắc Từ Liêm, Hà Nội</p>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}><Phone size={16} color={UNI_BLUE}/> +84 243 765 5121</p>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}><Mail size={16} color={UNI_BLUE}/> hotro@haui.edu.vn</p>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #e2e8f0", marginTop: "40px", paddingTop: "20px", fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>
        © 2026 HaUI Student Club Portal. All rights reserved.
      </div>
    </div>
  </footer>
);

export default PublicFooter;