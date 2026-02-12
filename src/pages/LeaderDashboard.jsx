import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

// Components
import LeaderChatPanel from "../components/chat/LeaderChatPanel";
import Header from "../components/dashboard/Header"; // Hoặc TopHeader nếu bạn đổi tên
import StatCard from "../components/dashboard/StatCard";
import Button from "../components/common/Button"; // Kiểm tra xem file này có tồn tại không

// 🔥 QUAN TRỌNG: Kiểm tra kỹ tên file trong folder components/tables/
import UsersTable from "../components/tables/UsersTable";       // Phải khớp tên file UsersTable.jsx
import ClubsTable from "../components/tables/ClubsTable";       // Phải khớp tên file ClubsTable.jsx
import InterviewsTable from "../components/tables/InterviewsTable"; // Phải khớp tên file InterviewsTable.jsx

// Modals
import UserModal from "../components/modals/UserModal"; // Nếu chưa tách thì dùng AdminDashboardModals
import ClubModal from "../components/modals/ClubModal"; // Nếu chưa tách thì dùng AdminDashboardModals

// Hooks
import { useUsers } from "../hooks/useUsers";         // Kiểm tra file này có chưa
import { useClubs } from "../hooks/useClubs";         // Kiểm tra file này có chưa
import { useInterviews } from "../hooks/useInterviews"; // Kiểm tra file này có chưa
import { COLORS } from "../styles/colors";            // Kiểm tra file colors.js

const LeaderDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingClub, setEditingClub] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState("");
  
  // Fake data context
  const clubId = "current-club-id"; 
  const clubName = "Tên Câu Lạc Bộ"; 

  const navigate = useNavigate();
  
  // Hook Users
  const {
    users,
    loading: userLoading,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  // Hook Clubs
  const {
    clubs,
    loading: clubLoading,
    createClub,
    updateClub,
    deleteClub,
  } = useClubs();

  // Hook Interviews
  const {
    interviews,
    loading: interviewLoading,
    fetchInterviews,
    setInterviews,
  } = useInterviews();

  // Effects
  useEffect(() => {
    if (clubs.length > 0 && !selectedClubId) {
      setSelectedClubId(clubs[0].clubId);
    }
  }, [clubs]);

  useEffect(() => {
    if (activeTab === "interviews" && selectedClubId) {
      fetchInterviews(selectedClubId);
    }
  }, [activeTab, selectedClubId]);

  // Handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleAddClub = () => {
    setEditingClub(null);
    setShowClubModal(true);
  };

  const handleEditClub = (club) => {
    setEditingClub(club);
    setShowClubModal(true);
  };

  const handleAddInterview = () => {
    navigate("/leader/interview/add", { state: { clubId: selectedClubId } });
  };

  const styles = {
    root: {
      minHeight: "100vh",
      background: COLORS.BG,
      color: COLORS.TEXT,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: 0,
      margin: 0,
      width: "100vw",
      boxSizing: "border-box",
    },
    content: {
      width: "100vw",
      minHeight: "calc(100vh - 110px)",
      padding: "0 32px 48px 32px",
      margin: 0,
      boxSizing: "border-box",
    },
    buttonContainer: {
      marginBottom: 18,
    },
    filterRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 18,
      flexWrap: "wrap",
      background: COLORS.ACCENT_BG,
      borderRadius: 12,
      padding: "12px 18px",
      boxShadow: "0 2px 8px #3b82f622",
    },
    filterLabel: {
      fontWeight: "bold",
      color: COLORS.BLUE_DARK,
      fontSize: 16,
      letterSpacing: 1,
    },
    select: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: `2px solid ${COLORS.ACCENT}`,
      fontSize: "16px",
      background: "#fff",
      color: COLORS.BLUE_DARK,
      fontWeight: "500",
      transition: "border 0.2s",
    },
  };

  return (
    <div style={styles.root}>
      {/* Header component có thể cần chỉnh lại props cho khớp */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={styles.content}>
        
        {/* USERS TAB */}
        {activeTab === "users" && (
          <>
            <StatCard
              icon="users"
              title="Quản lý tài khoản"
              description="Tạo/sửa/xóa tài khoản, cấp quyền và trạng thái hoạt động."
            />
            <div style={styles.buttonContainer}>
              <Button icon={Plus} onClick={handleAddUser}>
                Thêm mới
              </Button>
            </div>
            
            {/* Component Table */}
            <UsersTable
              users={users}
              loading={userLoading}
              onEdit={handleEditUser} // Lưu ý: UsersTable cần props này
              onDelete={deleteUser}   // Lưu ý: UsersTable cần props này
              // Nếu UsersTable dùng tên props khác (ví dụ onEditUser), hãy sửa lại cho khớp
            />

            {showUserModal && (
              <UserModal
                user={editingUser}
                onClose={() => setShowUserModal(false)}
                onSave={editingUser ? updateUser : createUser}
              />
            )}
          </>
        )}

        {/* CLUBS TAB */}
        {activeTab === "clubs" && (
          <>
            <StatCard
              icon="layers"
              title="Quản lý câu lạc bộ"
              description="Tạo/sửa/xóa câu lạc bộ, gán trưởng câu lạc bộ."
            />
            <div style={styles.buttonContainer}>
              <Button icon={Plus} onClick={handleAddClub}>
                Thêm câu lạc bộ
              </Button>
            </div>
            
            <ClubsTable
              clubs={clubs}
              loading={clubLoading}
              onEdit={handleEditClub}
              onDelete={deleteClub}
            />

            {showClubModal && (
              <ClubModal
                club={editingClub}
                users={users}
                onClose={() => setShowClubModal(false)}
                onSave={editingClub ? updateClub : createClub}
              />
            )}
          </>
        )}

        {/* INTERVIEWS TAB */}
        {activeTab === "interviews" && (
          <>
            <StatCard
              icon="clipboard"
              title="Quản lý phỏng vấn"
              description="Quản lý danh sách phỏng vấn ứng viên cho từng câu lạc bộ."
            />
            <div style={styles.filterRow}>
              <span style={styles.filterLabel}>Chọn CLB:</span>
              <select
                style={styles.select}
                value={selectedClubId}
                onChange={(e) => {
                  setSelectedClubId(e.target.value);
                  setInterviews([]);
                }}
              >
                {clubs.map((club) => (
                  <option key={club.clubId} value={club.clubId}>
                    {club.clubName}
                  </option>
                ))}
              </select>
              <Button icon={Plus} onClick={handleAddInterview}>
                Thêm phỏng vấn
              </Button>
            </div>
            
            <InterviewsTable
              interviews={interviews}
              loading={interviewLoading}
            />
          </>
        )}

        {/* CHAT SECTION */}
        <section style={{ padding: "40px 20px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <LeaderChatPanel clubId={clubId} clubName={clubName} />
          </div>
        </section>

      </div>
    </div>
  );
};

export default LeaderDashboard;