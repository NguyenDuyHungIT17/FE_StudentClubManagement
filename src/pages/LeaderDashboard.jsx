import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import Header from "../components/dashboard/Header";
import StatCard from "../components/dashboard/StatCard";
import Button from "../components/common/Button";
import UserTable from "../components/tables/UserTable";
import ClubTable from "../components/tables/ClubTable";
import InterviewTable from "../components/tables/InterviewTable";
import UserModal from "../components/modals/UserModal";
import ClubModal from "../components/modals/ClubModal";

import { useUsers } from "../hooks/useUsers";
import { useClubs } from "../hooks/useClubs";
import { useInterviews } from "../hooks/useInterviews";
import { COLORS } from "../styles/colors";

const LeaderDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingClub, setEditingClub] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState("");

  const navigate = useNavigate();
  
  const {
    users,
    loading: userLoading,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const {
    clubs,
    loading: clubLoading,
    createClub,
    updateClub,
    deleteClub,
  } = useClubs();

  const {
    interviews,
    loading: interviewLoading,
    fetchInterviews,
    setInterviews,
  } = useInterviews();

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
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={styles.content}>
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
            <UserTable
              users={users}
              loading={userLoading}
              onEdit={handleEditUser}
              onDelete={deleteUser}
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
            <ClubTable
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
            <InterviewTable
              interviews={interviews}
              loading={interviewLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderDashboard;