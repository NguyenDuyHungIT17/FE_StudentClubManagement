// src/pages/AdminDashboard.jsx
import React from "react";
import { ThemeProvider } from "../context/ThemeContext";

// Import Hooks chuẩn
import { useUsers } from "../hooks/useUsers";
import { useClubs } from "../hooks/useClubs"; 
import { useDashboardUI } from "../hooks/useDashboardUI";

import "../styles/UniClubsTheme.css";

// Components Layout
import Sidebar from "../components/common/Sidebar";
import TopHeader from "../components/common/TopHeader";
import StatsSection from "../components/dashboard/StatsSection";

// Components Tables
import UsersTable from "../components/tables/UsersTable";
import ClubsTable from "../components/tables/ClubsTable";

// Component Modals
import AdminDashboardModals from "../components/dashboard/AdminDashboardModals";

const DashboardContent = () => {
  // 1. LẤY DATA TỪ CÁC HOOK LOGIC
  const { 
    users, createUser, updateUser, deleteUser,
    keyword: userKeyword, setKeyword: setUserKeyword,
    filterRole: userFilterRole, setFilterRole: setUserFilterRole,
    page: userPage, setPage: setUserPage,
    paginationMeta: userPaginationMeta
  } = useUsers();
  
  const {
    clubs, createClub, updateClub, deleteClub,
    keyword, setKeyword, page, setPage, paginationMeta
  } = useClubs();

  // 2. LẤY STATE GIAO DIỆN TỪ HOOK UI
  const {
    activeTab, setActiveTab,

    // States cho User
    showUserModal, setShowUserModal, editingUser, setEditingUser,
    userForm, setUserForm, viewingUser, setViewingUser,
    showViewUserModal, setShowViewUserModal, 

    // States cho Club
    showClubModal, setShowClubModal, editingClub, setEditingClub,
    clubForm, setClubForm, viewingClub, setViewingClub,
    showViewClubModal, setShowViewClubModal,

    clubErrors, setClubErrors,
    userErrors, setUserErrors
  } = useDashboardUI();

  // =========================================================
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO USER ---
  // =========================================================
  const openAddUser = () => {
    setEditingUser(null);
    setUserForm({ fullName: "", email: "", password: "", role: "member", isActive: 1, clubId: "" });
    setUserErrors({});
    setShowUserModal(true);
  };

  const openEditUser = (u) => {
    setEditingUser(u.userId);
    setUserForm({ ...u, password: "", clubId: u.clubId || "" });
    setUserErrors({});
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    let errors = {};

    if (!userForm.fullName || !userForm.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ tên";
    }
    if (!userForm.email || !userForm.email.trim()) {
      errors.email = "Vui lòng nhập email";
    }
    if (!userForm.role) {
      errors.role = "Vui lòng chọn vai trò";
    }

    if (userForm.isActive === "" || userForm.isActive === null || userForm.isActive === undefined) {
      errors.isActive = "Vui lòng chọn trạng thái";
    }

    if (!editingUser) {
      if (!userForm.password || !userForm.password.trim()) {
        errors.password = "Vui lòng nhập mật khẩu";
      }
      if (!userForm.clubId) {
        errors.clubId = "Vui lòng chọn Câu lạc bộ";
      }
    }

    if (Object.keys(errors).length > 0) {
      setUserErrors(errors);
      return;
    }

    // Nếu form hợp lệ, xóa lỗi cũ
    setUserErrors({});

    if (editingUser) {
      const updatePayload = {
        email: userForm.email.trim(),
        fullName: userForm.fullName.trim(),
        role: userForm.role,
        isActive: parseInt(userForm.isActive)
      };

      const result = await updateUser(editingUser, updatePayload);
      if (result && result.success) {
        setShowUserModal(false);                 
      } else if (result.validationErrors) {
        setUserErrors(result.validationErrors);  
      } else {
        alert(result?.message || "Cập nhật thất bại!"); 
      }

    } else {
      const createPayload = {
        fullName: userForm.fullName.trim(),
        email: userForm.email.trim(),
        password: userForm.password,
        role: userForm.role,
        isActive: parseInt(userForm.isActive),
        clubId: userForm.clubId ? parseInt(userForm.clubId) : null
      };

      const result = await createUser(createPayload);
      if (result && result.success) {
        setShowUserModal(false);                 
      } else if (result.validationErrors) {
        setUserErrors(result.validationErrors);  
      } else {
        alert(result?.message || "Thêm mới thất bại!"); 
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      const result = await deleteUser(id);
      if (result && result.success) {
         // alert(result.message); 
      } else if (result.validationErrors) {
        const errorMessages = Object.values(result.validationErrors).join("\n");
        alert("Không thể xóa:\n" + errorMessages);
      } else {
        alert(result?.message || "Xóa thất bại!");
      }
    }
  };

  const openViewUser = (u) => { setViewingUser(u); setShowViewUserModal(true); };

  // =========================================================
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO CLUB ---
  // =========================================================
  const openAddClub = () => {
    setEditingClub(null);
    setClubForm({ clubName: "", title: "", description: "", leaderId: "" });
    setClubErrors({});
    setShowClubModal(true);
  };

  const openEditClub = (c) => {
    setEditingClub(c.clubId);
    setClubForm({
      clubName: c.clubName,
      title: c.title || "",
      description: c.description,
      leaderId: c.leaderId || ""
    });
    setClubErrors({});
    setShowClubModal(true);
  };

  const handleSaveClub = async () => {
    let errors = {};

    if (!clubForm.clubName || !clubForm.clubName.trim()) {
      errors.clubName = "Vui lòng nhập tên Câu lạc bộ";
    }
    if (!clubForm.title || !clubForm.title.trim()) {
      errors.title = "Vui lòng nhập tiêu đề";
    }

    if (Object.keys(errors).length > 0) {
      setClubErrors(errors);
      return;
    }
    
    setClubErrors({});

    const payload = {
      clubName: clubForm.clubName.trim(),
      title: clubForm.title?.trim() || "",
      description: clubForm.description?.trim() || "",
      leaderId: clubForm.leaderId ? parseInt(clubForm.leaderId) : null
    };

    const result = editingClub
      ? await updateClub(editingClub, payload)
      : await createClub(payload);

    if (result && result.success) {
      setShowClubModal(false);
    } else if (result.validationErrors) {
      setClubErrors(result.validationErrors);
    } else {
      alert(result?.message || "Lỗi thao tác!");
    }
  };

  const handleDeleteClub = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Câu lạc bộ này?")) {
      const result = await deleteClub(id);
      if (result && result.success) {
         // alert(result.message);
      } else if (result.validationErrors) {
        const errorMessages = Object.values(result.validationErrors).join("\n");
        alert("Không thể xóa:\n" + errorMessages);
      } else {
        alert(result?.message || "Xóa thất bại!");
      }
    }
  };

  const openViewClub = (c) => { setViewingClub(c); setShowViewClubModal(true); };


  // =========================================================
  // GIAO DIỆN CHÍNH
  // =========================================================
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Khung nội dung chính */}
      <main className="main-content">
        <div className="scrollable-area">
          <TopHeader title={activeTab} />

          {/* Hiển thị số lượng dựa trên tổng số bản ghi từ Meta Phân Trang */}
          <StatsSection usersCount={userPaginationMeta.TotalCount || 0} clubsCount={paginationMeta.TotalCount || 0} />

          {/* TAB USERS */}
          {activeTab === "users" && (
            <UsersTable
              users={users}

              keyword={userKeyword}
              onSearch={setUserKeyword}
              page={userPage}
              totalPages={userPaginationMeta.TotalPages}
              onPageChange={setUserPage}

              filterRole={userFilterRole}
              onFilterChange={setUserFilterRole}
              onAdd={openAddUser}
              onEdit={openEditUser}
              onDelete={handleDeleteUser}
              onView={openViewUser}
            />
          )}

          {/* TAB CLUBS */}
          {activeTab === "clubs" && (
            <ClubsTable
              clubs={clubs}
              keyword={keyword}               
              onSearch={setKeyword}           
              page={page}                     
              totalPages={paginationMeta.TotalPages} 
              onPageChange={setPage}          
              onAdd={openAddClub}
              onEdit={openEditClub}
              onDelete={handleDeleteClub}
              onView={openViewClub}
            />
          )}

          {activeTab === "members" && <div><h1>Đang chờ code Hook Thành viên...</h1></div>}
          {activeTab === "interviews" && <div><h1>Đang chờ code Hook Phỏng vấn...</h1></div>}

        </div>
      </main>

      {/* TẬP HỢP TẤT CẢ MODAL/POPUP VÀO ĐÂY */}
      <AdminDashboardModals
        showUserModal={showUserModal} setShowUserModal={setShowUserModal}
        userForm={userForm} setUserForm={setUserForm}
        editingUser={editingUser} handleSaveUser={handleSaveUser}
        showViewUserModal={showViewUserModal} setShowViewUserModal={setShowViewUserModal}
        viewingUser={viewingUser}

        showClubModal={showClubModal} setShowClubModal={setShowClubModal}
        clubForm={clubForm} setClubForm={setClubForm}
        editingClub={editingClub} handleSaveClub={handleSaveClub}
        showViewClubModal={showViewClubModal} setShowViewClubModal={setShowViewClubModal}
        viewingClub={viewingClub}

        userErrors={userErrors} setUserErrors={setUserErrors} 
        clubErrors={clubErrors} setClubErrors={setClubErrors}
        
        users={users}
        clubs={clubs} 
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