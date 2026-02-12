import React from "react";
import { ThemeProvider } from "../context/ThemeContext";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import "../styles/UniClubsTheme.css";

// Components Layout
import Sidebar from "../components/common/Sidebar";
import TopHeader from "../components/common/TopHeader";
import StatsSection from "../components/dashboard/StatsSection";

// Components Tables
import UsersTable from "../components/tables/UsersTable";
import ClubsTable from "../components/tables/ClubsTable";
import MembersTable from "../components/tables/MembersTable";
import InterviewsTable from "../components/tables/InterviewsTable";

// Component Modals (Chứa tất cả các form)
import AdminDashboardModals from "../components/dashboard/AdminDashboardModals";

const DashboardContent = () => {
  // Lấy TOÀN BỘ state và function từ Custom Hook
  const {
    // 1. State UI & Data
    activeTab, setActiveTab,
    users, clubs, interviews, clubMembers,
    
    // 2. Filters & Selection States
    userFilterRole, setUserFilterRole,
    selectedClubId, setSelectedClubId,
    selectedMemberClubId, setSelectedMemberClubId,
    interviewFilterResult, setInterviewFilterResult,

    // 3. CRUD Handlers (Truyền xuống các Table)
    openAddUser, openEditUser, deleteUser, viewUser,
    openAddClub, openEditClub, deleteClub, viewClub,
    openAddMember, openEditMember, deleteMember, viewMember,
    openAddInterview, openEditInterview, deleteInterview, viewInterview, 
    sendEmail, // Hàm mở modal gửi email

    // 4. Modal Props (Spread toàn bộ props liên quan đến modal/form)
    ...modalProps 
  } = useAdminDashboard();

  // Helper: Lọc ra user chưa tham gia CLB đang chọn (để truyền vào Modal Member)
  const getAvailableUsers = () => {
    if (!clubMembers) return users;
    const memberUserIds = clubMembers.map((m) => m.userId);
    return users.filter((u) => !memberUserIds.includes(u.userId));
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar bên trái */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Nội dung chính bên phải */}
      <main className="main-content">
        <div className="scrollable-area">
          {/* Header trên cùng (Title + Theme Toggle + User Info) */}
          <TopHeader title={activeTab} />
          
          {/* 3 Thẻ thống kê */}
          <StatsSection usersCount={users.length} clubsCount={clubs.length} />

          {/* --- NỘI DUNG THAY ĐỔI THEO TAB --- */}

          {/* 1. Tab Users */}
          {activeTab === "users" && (
            <UsersTable 
              users={users}
              filterRole={userFilterRole}
              onFilterChange={setUserFilterRole}
              onAdd={openAddUser}
              onEdit={openEditUser}
              onDelete={deleteUser}
              onView={viewUser}
            />
          )}

          {/* 2. Tab Clubs */}
          {activeTab === "clubs" && (
            <ClubsTable 
              clubs={clubs}
              onAdd={openAddClub}
              onEdit={openEditClub}
              onDelete={deleteClub}
              onView={viewClub}
            />
          )}

          {/* 3. Tab Members */}
          {activeTab === "members" && (
            <MembersTable 
              members={clubMembers}
              clubs={clubs}
              selectedClubId={selectedMemberClubId}
              onSelectClub={setSelectedMemberClubId}
              onAdd={openAddMember} 
              onEdit={openEditMember}
              onDelete={deleteMember}
              onView={viewMember}
            />
          )}

          {/* 4. Tab Interviews */}
          {activeTab === "interviews" && (
            <InterviewsTable 
              interviews={interviews}
              clubs={clubs}
              selectedClubId={selectedClubId}
              onSelectClub={setSelectedClubId}
              filterResult={interviewFilterResult}
              onFilterResult={setInterviewFilterResult}
              onAdd={openAddInterview}
              onEdit={openEditInterview}
              onDelete={deleteInterview}
              onView={viewInterview}
              onSendEmail={() => modalProps.setShowEmailModal(true)} // Mở modal email thủ công từ nút trên table
            />
          )}
        </div>
      </main>

      {/* --- MODAL MANAGER --- */}
      {/* Component này ẩn, chỉ hiện lên khi các state showModal = true */}
      <AdminDashboardModals 
        {...modalProps} // Truyền tất cả state showModal, form data, handleSave... xuống
        users={users}   // Truyền danh sách user để fill vào dropdown select
        availableUsers={getAvailableUsers()} // Truyền user chưa join clb để fill dropdown add member
      />
    </div>
  );
};

// Wrap component chính trong ThemeProvider để dùng Context Theme
const AdminDashboard = () => (
  <ThemeProvider>
    <DashboardContent />
  </ThemeProvider>
);

export default AdminDashboard;