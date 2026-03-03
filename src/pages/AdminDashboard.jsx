// src/pages/AdminDashboard.jsx
import React from "react";
import { ThemeProvider } from "../context/ThemeContext";

// Import Hooks chuẩn
import { useUsers } from "../hooks/useUsers";
import { useDashboardUI } from "../hooks/useDashboardUI";

import "../styles/UniClubsTheme.css";

// Components Layout
import Sidebar from "../components/common/Sidebar";
import TopHeader from "../components/common/TopHeader";
import StatsSection from "../components/dashboard/StatsSection";

// Components Tables
import UsersTable from "../components/tables/UsersTable";
// Tạm ẩn các bảng khác cho đến khi bạn viết xong hook useClubs, useMembers...
// import ClubsTable from "../components/tables/ClubsTable"; 
// import MembersTable from "../components/tables/MembersTable";
// import InterviewsTable from "../components/tables/InterviewsTable";

// Component Modals
import AdminDashboardModals from "../components/dashboard/AdminDashboardModals";

const DashboardContent = () => {
  // 1. LẤY DATA & LOGIC TỪ HOOK useUsers
  const { 
    users, 
    createUser, 
    updateUser, 
    deleteUser 
  } = useUsers();

  // 2. LẤY STATE GIAO DIỆN TỪ HOOK useDashboardUI
  const {
    activeTab, setActiveTab,
    
    // States cho User Modal
    showUserModal, setShowUserModal,
    editingUser, setEditingUser,
    userForm, setUserForm,
    viewingUser, setViewingUser,
    showViewUserModal, setShowViewUserModal,
    
    // State cho Lọc
    userFilterRole, setUserFilterRole,
  } = useDashboardUI();

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO USER ---
  const openAddUser = () => { 
    setEditingUser(null); 
    setUserForm({ fullName: "", email: "", password: "", role: "member", isActive: 1 }); 
    setShowUserModal(true); 
  };
  
  const openEditUser = (u) => { 
    setEditingUser(u.userId); 
    setUserForm({ ...u, password: "" }); // Không điền sẵn pass cũ
    setShowUserModal(true); 
  };

const handleSaveUser = async () => {
    // 1. Kiểm tra dữ liệu rỗng
    if (!userForm.fullName.trim() || !userForm.email.trim()) {
      alert("Vui lòng nhập đầy đủ Họ tên và Email!");
      return;
    }

    if (editingUser) {
  // Tạo cục dữ liệu khớp 100% với định dạng Swagger bạn vừa gửi
      const updatePayload = {
        email: userForm.email.trim(),
        fullName: userForm.fullName.trim(),
        role: userForm.role,       // vd: "member", "leader", "admin"
        isActive: userForm.isActive // vd: 1 hoặc 0
      };

      // Gọi hook updateUser (truyền vào ID và Payload)
      const result = await updateUser(editingUser, updatePayload);
      
      if (result){
        setShowUserModal(false); // Đóng popup khi thành công
      }

    } else {
      if (!userForm.password.trim()) {
        alert("Vui lòng nhập mật khẩu cho tài khoản mới!");
        return;
      }

      // Thêm mới thì payload phải có thêm trường password
      const createPayload = {
        fullName: userForm.fullName.trim(),
        email: userForm.email.trim(),
        password: userForm.password, 
        role: userForm.role,
        isActive: parseInt(userForm.isActive),
        // Ép kiểu clubId sang số nguyên (integer), nếu không chọn thì gửi null
        clubId: userForm.clubId ? parseInt(userForm.clubId) : null 
      };

      const result = await createUser(createPayload);
      
      if (result) {
        setShowUserModal(false); // Đóng popup khi thành công
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      const result = await deleteUser(id);
      if (result && result.success) {
        alert(result.message);
      }
    }
  };

  const openViewUser = (u) => { 
    setViewingUser(u); 
    setShowViewUserModal(true); 
  };

  // --------------------------------------------------------

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Khung nội dung chính */}
      <main className="main-content">
        <div className="scrollable-area">
          <TopHeader title={activeTab} />
          
          <StatsSection usersCount={users.length} clubsCount={0} /> {/* Tạm để clubsCount = 0 */}

          {/* TAB USERS */}
          {activeTab === "users" && (
            <UsersTable 
              users={users}
              filterRole={userFilterRole}
              onFilterChange={setUserFilterRole}
              onAdd={openAddUser}
              onEdit={openEditUser}
              onDelete={handleDeleteUser}
              onView={openViewUser}
            />
          )}

          {/* Các Tab khác: Bạn sẽ mở comment ra khi code xong hook useClubs, useMembers... */}
          {activeTab === "clubs" && <div><h1>Đang chờ code Hook Câu lạc bộ...</h1></div>}
          {activeTab === "members" && <div><h1>Đang chờ code Hook Thành viên...</h1></div>}
          {activeTab === "interviews" && <div><h1>Đang chờ code Hook Phỏng vấn...</h1></div>}

        </div>
      </main>

      {/* TẬP HỢP TẤT CẢ MODAL/POPUP VÀO ĐÂY */}
      <AdminDashboardModals 
        showUserModal={showUserModal} 
        setShowUserModal={setShowUserModal}
        userForm={userForm} 
        setUserForm={setUserForm}
        editingUser={editingUser}
        handleSaveUser={handleSaveUser}
        
        showViewUserModal={showViewUserModal} 
        setShowViewUserModal={setShowViewUserModal}
        viewingUser={viewingUser}
        
        // Mấy cái liên quan tới Club tạm truyền null/mảng rỗng để không bị lỗi
        users={users}
        availableUsers={[]} 
      />
    </div>
  );
};

const AdminDashboard = () => (
  <ThemeProvider>
    <DashboardContent />
  </ThemeProvider>
);

export default AdminDashboard;