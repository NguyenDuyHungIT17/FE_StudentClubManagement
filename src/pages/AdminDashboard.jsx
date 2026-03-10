// src/pages/AdminDashboard.jsx
import React from "react";
import { ThemeProvider } from "../context/ThemeContext";

// Import Hooks chuẩn
import { useUsers } from "../hooks/useUsers";
import { useClubs } from "../hooks/useClubs"; // ✅ FIX: Đã thêm import useClubs
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
  const { users, createUser, updateUser, deleteUser } = useUsers();
  const {
    clubs, createClub, updateClub, deleteClub,
    keyword, setKeyword, page, setPage, paginationMeta
  } = useClubs();

  // 2. LẤY STATE GIAO DIỆN TỪ HOOK UI (✅ FIX: Đã gộp gọn gàng làm 1 lần gọi)
  const {
    activeTab, setActiveTab,

    // States cho User
    showUserModal, setShowUserModal, editingUser, setEditingUser,
    userForm, setUserForm, viewingUser, setViewingUser,
    showViewUserModal, setShowViewUserModal, userFilterRole, setUserFilterRole,

    // States cho Club
    showClubModal, setShowClubModal, editingClub, setEditingClub,
    clubForm, setClubForm, viewingClub, setViewingClub,
    showViewClubModal, setShowViewClubModal
  } = useDashboardUI();

  // =========================================================
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO USER ---
  // =========================================================
  const openAddUser = () => {
    setEditingUser(null);
    setUserForm({ fullName: "", email: "", password: "", role: "member", isActive: 1, clubId: "" });
    setShowUserModal(true);
  };

  const openEditUser = (u) => {
    setEditingUser(u.userId);
    setUserForm({ ...u, password: "", clubId: u.clubId || "" }); // Đảm bảo fill đủ form
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    if (!userForm.fullName.trim() || !userForm.email.trim()) {
      alert("Vui lòng nhập đầy đủ Họ tên và Email!");
      return;
    }

    if (editingUser) {
      const updatePayload = {
        email: userForm.email.trim(),
        fullName: userForm.fullName.trim(),
        role: userForm.role,
        isActive: userForm.isActive
      };

      const result = await updateUser(editingUser, updatePayload);
      if (result) setShowUserModal(false);

    } else {
      if (!userForm.password.trim()) {
        alert("Vui lòng nhập mật khẩu cho tài khoản mới!");
        return;
      }

      const createPayload = {
        fullName: userForm.fullName.trim(),
        email: userForm.email.trim(),
        password: userForm.password,
        role: userForm.role,
        isActive: parseInt(userForm.isActive),
        clubId: userForm.clubId ? parseInt(userForm.clubId) : null
      };

      const result = await createUser(createPayload);
      if (result) setShowUserModal(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      await deleteUser(id);
    }
  };

  const openViewUser = (u) => { setViewingUser(u); setShowViewUserModal(true); };

  // =========================================================
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO CLUB ---
  // =========================================================
  const openAddClub = () => {
    setEditingClub(null);
    setClubForm({ clubName: "", title: "", description: "", leaderId: "" });
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
    setShowClubModal(true);
  };

  const handleSaveClub = async () => {
    // 1. Kiểm tra validate
    if (!clubForm.clubName.trim()) {
      alert("Vui lòng nhập tên Câu lạc bộ!");
      return;
    }

    // 2. Chuẩn bị dữ liệu gửi đi
    const payload = {
      clubName: clubForm.clubName.trim(),
      title: clubForm.title?.trim() || "",
      description: clubForm.description?.trim() || "",
      leaderId: clubForm.leaderId ? parseInt(clubForm.leaderId) : null
    };

    // 3. Gọi API (Sửa hoặc Thêm mới)
    const result = editingClub
      ? await updateClub(editingClub, payload)
      : await createClub(payload);

    // 4. Xử lý kết quả trả về TẠI MỘT CHỖ DUY NHẤT
    if (result && result.success) {
      alert(result.message);         // Báo thành công (chỉ 1 lần)
      setShowClubModal(false);       // TẮT FORM -> Tự động quay về màn hình List
    } else {
      alert(result?.message || "Có lỗi xảy ra từ máy chủ!"); // Báo lỗi nếu thất bại
    }
  };

  const handleDeleteClub = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Câu lạc bộ này?")) {
      await deleteClub(id);
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

          {/* ✅ FIX: Hiển thị đúng số lượng Club */}
          <StatsSection usersCount={users.length} clubsCount={clubs.length} />

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

          {/* TAB CLUBS */}
          {activeTab === "clubs" && (
            <ClubsTable
              clubs={clubs}
              keyword={keyword}               // Truyền từ khóa tìm kiếm
              onSearch={setKeyword}           // Hàm cập nhật từ khóa
              page={page}                     // Trang hiện hành
              totalPages={paginationMeta.TotalPages} // Tổng số trang
              onPageChange={setPage}          // Hàm chuyển trang
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

        // Dữ liệu dùng chung
        users={users}
        clubs={clubs} // ✅ FIX: Đã truyền mảng clubs vào form
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