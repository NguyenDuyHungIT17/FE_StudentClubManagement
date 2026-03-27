import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogIn, Users, Building, Calendar } from "lucide-react";
export const UNI_BLUE = "#003366";
export const UNI_RED = "#cc0000";

const PublicHeader = () => {
  const navigate = useNavigate();

  // Hàm cuộn trang đến Section
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <div style={{ background: UNI_BLUE, color: "#fff", fontSize: "14px", padding: "8px 0" }}>
        <div className="portal-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700 }}>CỔNG THÔNG TIN CÂU LẠC BỘ SINH VIÊN</div>
          <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }} onClick={() => navigate("/login")}>
            <LogIn size={16} /> Đăng nhập hệ thống
          </div>
        </div>
      </div>

      {/* LOGO */}
      <header style={{ background: "#fff", padding: "20px 0", borderBottom: "1px solid #e2e8f0" }}>
        <div className="portal-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", cursor: "pointer" }} onClick={() => scrollTo("home")}>
            <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: UNI_BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "900", boxShadow: "0 8px 16px rgba(0,51,102,0.2)" }}>
              HaUI
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "900", color: UNI_BLUE, textTransform: "uppercase" }}>ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI</h1>
              <h2 style={{ margin: "4px 0 0 0", fontSize: "15px", color: UNI_RED, textTransform: "uppercase", fontWeight: "800" }}>Hệ thống Quản lý Câu lạc bộ & Sự kiện</h2>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", border: "2px solid #e2e8f0", borderRadius: "999px", padding: "10px 20px", width: "300px", background: "#f8fafc" }}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Tìm kiếm CLB, sự kiện..." style={{ border: "none", outline: "none", background: "transparent", width: "100%", marginLeft: "10px", fontSize: "15px", fontFamily: "inherit" }} />
          </div>
        </div>
      </header>

      {/* MENU CÓ HOẠT ĐỘNG CLICK */}
      <nav style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="portal-container">
          <ul style={{ listStyle: "none", margin: 0, padding: "0", display: "flex", gap: "20px", fontSize: "15px", fontWeight: "700" }}>
            <li style={{ padding: "18px 5px", color: UNI_BLUE, borderBottom: `3px solid ${UNI_RED}`, cursor: "pointer" }} onClick={() => scrollTo("home")}>Trang chủ</li>
            <li style={{ padding: "18px 5px", color: "#475569", cursor: "pointer" }} onClick={() => scrollTo("campaigns")}>Đợt Tuyển Sinh</li>
            <li style={{ padding: "18px 5px", color: "#475569", cursor: "pointer" }} onClick={() => scrollTo("events")}>Sự Kiện</li>
            <li style={{ padding: "18px 5px", color: "#475569", cursor: "pointer" }} onClick={() => scrollTo("clubs")}>Danh sách Câu lạc bộ</li>
          </ul>
        </div>
      </nav>

      {/* BANNER KHỔNG LỒ */}
      <div id="home" style={{ padding: "30px 0 0", background: "#f8fafc" }}>
        <div className="portal-container">
          <div style={{ width: "100%", height: "420px", background: "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070') center/cover", borderRadius: "30px", position: "relative", overflow: "hidden", boxShadow: "0 15px 40px rgba(0,0,0,0.1)" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0, 51, 102, 0.9), rgba(0, 51, 102, 0.2))" }}></div>
            <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "60px", color: "#fff", maxWidth: "700px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.2)", padding: "8px 20px", borderRadius: "999px", fontSize: "14px", fontWeight: "800", marginBottom: "20px", backdropFilter: "blur(5px)" }}>
                <Users size={16}/> Chào đón Tân sinh viên K19
              </div>
              <h2 style={{ fontSize: "52px", fontWeight: "900", margin: "0 0 15px 0", lineHeight: "1.15" }}>Khơi nguồn sáng tạo,<br/><span style={{ color: "#fca5a5" }}>Kết nối đam mê.</span></h2>
              <p style={{ fontSize: "18px", opacity: 0.9, lineHeight: "1.6", margin: 0 }}>Hệ thống quản lý và tham gia câu lạc bộ hiện đại nhất dành cho sinh viên HaUI. Khám phá hàng trăm sự kiện và cộng đồng đang chờ đón bạn.</p>
            </div>
          </div>
          
          {/* THANH THỐNG KÊ (Giúp lấp đầy khoảng trắng 2 bên) */}
          <div style={{ display: "flex", gap: "20px", marginTop: "-40px", position: "relative", zIndex: 10, padding: "0 40px" }}>
            <div style={{ flex: 1, background: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "15px", border: "1px solid #f1f5f9" }}>
              <div style={{ background: "#eff6ff", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: UNI_BLUE }}><Building size={24}/></div>
              <div><div style={{ fontSize: "24px", fontWeight: "900", color: UNI_BLUE }}>50+</div><div style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>Câu Lạc Bộ</div></div>
            </div>
            <div style={{ flex: 1, background: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "15px", border: "1px solid #f1f5f9" }}>
              <div style={{ background: "#fef2f2", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: UNI_RED }}><Users size={24}/></div>
              <div><div style={{ fontSize: "24px", fontWeight: "900", color: UNI_RED }}>12,000+</div><div style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>Sinh Viên Tham Gia</div></div>
            </div>
            <div style={{ flex: 1, background: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "15px", border: "1px solid #f1f5f9" }}>
              <div style={{ background: "#f0fdf4", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}><Calendar size={24}/></div>
              <div><div style={{ fontSize: "24px", fontWeight: "900", color: "#10b981" }}>300+</div><div style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>Sự Kiện Hàng Năm</div></div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PublicHeader;