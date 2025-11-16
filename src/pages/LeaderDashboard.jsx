import React, { useState, useEffect } from "react";
import { Users, Layers, ClipboardList, Plus, Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BLUE = "#3b82f6";
const BLUE_DARK = "#1e40af";
const BG = "#eff6ff";
const BORDER = "#bfdbfe";
const TEXT = "#1f2937";
const CARD = "#fff";
const CARD_SHADOW = "0 2px 16px #3b82f622";
const ACCENT = "#60a5fa";
const ACCENT_BG = "#dbeafe";

const LeaderDashboard = () => {
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clubLoading, setClubLoading] = useState(true);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "member",
    isActive: 1,
  });

  const [showClubModal, setShowClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [clubForm, setClubForm] = useState({
    clubName: "",
    description: "",
    leaderId: "",
  });

  const [editingInterview, setEditingInterview] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    clubId: "",
    applicantName: "",
    applicantEmail: "",
    evaluation: "",
    result: "Pending",
  });
  const [selectedClubId, setSelectedClubId] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchClubs();
  }, []);

  useEffect(() => {
    if (activeTab === "interviews" && selectedClubId) {
      fetchInterviews(selectedClubId);
    }
  }, [activeTab, selectedClubId]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7251/api/Users", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách người dùng");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    setClubLoading(true);
    try {
      const res = await fetch("https://localhost:7251/api/Clubs", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách câu lạc bộ");
      const data = await res.json();
      setClubs(data);
      if (data.length > 0 && !selectedClubId) setSelectedClubId(data[0].clubId);
    } catch (err) {
      alert(err.message);
    } finally {
      setClubLoading(false);
    }
  };

  const fetchInterviews = async (clubId) => {
    setInterviewLoading(true);
    try {
      const res = await fetch(`https://localhost:7251/api/Interviews/club/${clubId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách phỏng vấn");
      const data = await res.json();
      setInterviews(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ fullName: "", email: "", password: "", role: "member", isActive: 1 });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user.userId);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;
    try {
      const res = await fetch(`https://localhost:7251/api/Users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Lỗi khi xóa user");
      alert("Xóa thành công!");
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `https://localhost:7251/api/Users/${editingUser}`
        : "https://localhost:7251/api/Users";
      const dataToSend = editingUser
        ? { ...formData, password: undefined }
        : formData;
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Lỗi khi lưu user");
      }
      alert(editingUser ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddClub = () => {
    setEditingClub(null);
    setClubForm({ clubName: "", description: "", leaderId: "" });
    setShowClubModal(true);
  };

  const handleEditClub = (club) => {
    let leaderId = "";
    if (club.leaderName && club.leaderName !== "Cập nhật sau") {
      const leader = users.find(
        (u) => u.fullName === club.leaderName || u.email === club.leaderName
      );
      leaderId = leader ? leader.userId : "";
    }
    setEditingClub(club.clubId);
    setClubForm({
      clubName: club.clubName,
      description: club.description,
      leaderId: leaderId,
    });
    setShowClubModal(true);
  };

  const handleDeleteClub = async (clubId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa câu lạc bộ này?")) return;
    try {
      const res = await fetch(`https://localhost:7251/api/Clubs/${clubId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Lỗi khi xóa câu lạc bộ");
      alert("Xóa thành công");
      fetchClubs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveClub = async () => {
    try {
      const method = editingClub ? "PUT" : "POST";
      const url = editingClub
        ? `https://localhost:7251/api/Clubs/${editingClub}`
        : "https://localhost:7251/api/Clubs";
      let dataToSend;
      if (editingClub) {
        dataToSend = {
          id: editingClub,
          clubName: clubForm.clubName,
          description: clubForm.description,
          leaderId: clubForm.leaderId ? parseInt(clubForm.leaderId) : null,
        };
      } else {
        dataToSend = {
          clubName: clubForm.clubName,
          description: clubForm.description,
        };
      }
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Lỗi khi lưu câu lạc bộ");
      }
      alert(editingClub ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setShowClubModal(false);
      fetchClubs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddInterview = () => {
    navigate("/leader/interview/add", { state: { clubId: selectedClubId } });
  };

  const handleEditInterview = (interview) => {
    setEditingInterview(interview.interviewId);
    setInterviewForm({
      clubId: interview.clubId,
      applicantName: interview.applicantName,
      applicantEmail: interview.applicantEmail,
      evaluation: interview.evaluation,
      result: interview.result,
    });
  };

  const styles = {
    root: {
      minHeight: "100vh",
      background: BG,
      color: TEXT,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: 0,
      margin: 0,
      width: "100vw",
      boxSizing: "border-box",
    },
    header: {
      display: "flex",
      alignItems: "center",
      padding: "18px 32px",
      background: BLUE,
      borderBottom: `2px solid ${BORDER}`,
      borderRadius: "0 0 24px 24px",
      boxShadow: "0 2px 8px #3b82f622",
      marginBottom: 32,
      gap: 18,
      width: "100%",
      boxSizing: "border-box",
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: 12,
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 28,
      fontWeight: "bold",
      color: BLUE,
    },
    title: {
      fontWeight: "bold",
      fontSize: 28,
      color: "#fff",
      letterSpacing: 1,
      flex: 1,
    },
    nav: {
      display: "flex",
      gap: 12,
    },
    navBtn: (active) => ({
      background: active ? BLUE_DARK : "#fff",
      color: active ? "#fff" : BLUE_DARK,
      border: `1.5px solid ${BORDER}`,
      borderRadius: 12,
      padding: "8px 18px",
      fontWeight: "bold",
      fontSize: 16,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 8,
      boxShadow: active ? "0 2px 8px #3b82f622" : "none",
      transition: "all 0.2s",
    }),
    content: {
      width: "100vw",
      minHeight: "calc(100vh - 110px)",
      padding: "0 0 48px 0",
      margin: 0,
      boxSizing: "border-box",
    },
    card: {
      background: CARD,
      borderRadius: 18,
      boxShadow: CARD_SHADOW,
      padding: 24,
      marginBottom: 28,
      display: "flex",
      alignItems: "center",
      gap: 18,
      border: `1.5px solid ${BORDER}`,
      width: "100%",
      boxSizing: "border-box",
      maxWidth: "100vw",
    },
    cardIcon: {
      background: BLUE,
      color: "#fff",
      borderRadius: 12,
      width: 48,
      height: 48,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 28,
    },
    cardContent: { flex: 1 },
    cardTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: BLUE_DARK,
      marginBottom: 6,
    },
    cardDesc: { fontSize: 15, color: "#1e3a8a" },
    addButton: {
      background: ACCENT,
      color: "#fff",
      border: "none",
      padding: "10px 22px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      marginBottom: "15px",
      boxShadow: "0 2px 8px #3b82f622",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "background 0.2s",
    },
    tableWrap: {
      background: CARD,
      borderRadius: 16,
      boxShadow: CARD_SHADOW,
      padding: 0,
      overflow: "auto",
      border: `1.5px solid ${BORDER}`,
      width: "100vw",
      boxSizing: "border-box",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "transparent",
      minWidth: 900,
    },
    th: {
      padding: "12px",
      textAlign: "left",
      background: ACCENT_BG,
      color: BLUE_DARK,
      fontWeight: "bold",
      border: "none",
      fontSize: "15px",
      letterSpacing: 1,
    },
    td: {
      padding: "12px",
      borderBottom: `1px solid ${BORDER}`,
      color: TEXT,
      fontSize: "15px",
      background: "transparent",
    },
    actionButton: (color) => ({
      cursor: "pointer",
      color,
      marginRight: "10px",
      border: "none",
      background: "none",
      padding: 0,
      transition: "color 0.2s",
      fontSize: 16,
    }),
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "#0005",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    modal: {
      background: ACCENT_BG,
      borderRadius: "18px",
      padding: "32px",
      width: "420px",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      position: "relative",
      boxShadow: CARD_SHADOW,
      border: `2px solid ${ACCENT}`,
    },
    input: {
      padding: "14px",
      borderRadius: "10px",
      border: `2px solid ${ACCENT}`,
      fontSize: "16px",
      outline: "none",
      background: "#fff",
      marginBottom: "2px",
      color: TEXT,
      fontWeight: "500",
      transition: "border 0.2s",
    },
    select: {
      padding: "14px",
      borderRadius: "10px",
      border: `2px solid ${ACCENT}`,
      fontSize: "16px",
      background: "#fff",
      color: BLUE_DARK,
      fontWeight: "500",
      marginBottom: "2px",
      transition: "border 0.2s",
    },
    saveButton: {
      background: BLUE_DARK,
      color: "#fff",
      border: "none",
      padding: "14px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "17px",
      marginTop: "10px",
      boxShadow: "0 2px 8px #3b82f622",
      letterSpacing: 1,
      transition: "background 0.2s",
    },
    closeButton: {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: BLUE_DARK,
      fontSize: 22,
    },
    modalTitle: {
      fontWeight: "bold",
      fontSize: "22px",
      color: BLUE_DARK,
      marginBottom: "8px",
      textAlign: "center",
      letterSpacing: 1,
    },
    filterRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 18,
      flexWrap: "wrap",
      background: ACCENT_BG,
      borderRadius: 12,
      padding: "12px 18px",
      boxShadow: "0 2px 8px #3b82f622",
    },
    filterLabel: {
      fontWeight: "bold",
      color: BLUE_DARK,
      fontSize: 16,
      letterSpacing: 1,
    },
  };

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={styles.logo}>👑</div>
        <span style={styles.title}>LEADER DASHBOARD</span>
        <nav style={styles.nav}>
          <button
            style={styles.navBtn(activeTab === "users")}
            onClick={() => setActiveTab("users")}
          >
            <Users /> Tài khoản
          </button>
          <button
            style={styles.navBtn(activeTab === "clubs")}
            onClick={() => setActiveTab("clubs")}
          >
            <Layers /> Câu lạc bộ
          </button>
          <button
            style={styles.navBtn(activeTab === "interviews")}
            onClick={() => setActiveTab("interviews")}
          >
            <ClipboardList /> Phỏng vấn
          </button>
        </nav>
      </header>

      <div style={styles.content}>
        {activeTab === "users" && (
          <>
            <div style={styles.card}>
              <div style={styles.cardIcon}>
                <Users size={28} />
              </div>
              <div style={styles.cardContent}>
                <div style={styles.cardTitle}>Quản lý tài khoản</div>
                <div style={styles.cardDesc}>
                  Tạo/sửa/xóa tài khoản, cấp quyền và trạng thái hoạt động.
                </div>
              </div>
            </div>
            <button style={styles.addButton} onClick={handleAdd}>
              <Plus size={18} /> Thêm mới
            </button>
            <div style={styles.tableWrap}>
              {loading ? (
                <p style={{ padding: 24 }}>Đang tải...</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Tên</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Trạng thái</th>
                      <th style={styles.th}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.userId}>
                        <td style={styles.td}>{user.userId}</td>
                        <td style={styles.td}>{user.fullName}</td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>{user.role}</td>
                        <td style={styles.td}>
                          {user.isActive ? "Active" : "Inactive"}
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.actionButton(BLUE_DARK)}
                            onClick={() => handleEdit(user)}
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            style={styles.actionButton("#ef4444")}
                            onClick={() => handleDelete(user.userId)}
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {showModal && (
              <div style={styles.modalOverlay}>
                <div style={styles.modal}>
                  <button
                    style={styles.closeButton}
                    onClick={() => setShowModal(false)}
                  >
                    <X />
                  </button>
                  <div style={styles.modalTitle}>
                    {editingUser ? "Sửa thông tin user" : "Thêm user mới"}
                  </div>
                  <label style={{ color: BLUE_DARK, fontWeight: "bold" }}>Họ tên</label>
                  <input
                    style={styles.input}
                    placeholder="Nhập họ tên"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                  <label style={{ color: BLUE_DARK, fontWeight: "bold" }}>Email</label>
                  <input
                    style={styles.input}
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {!editingUser && (
                    <>
                      <label style={{ color: BLUE_DARK, fontWeight: "bold" }}>Mật khẩu</label>
                      <input
                        style={styles.input}
                        placeholder="Nhập mật khẩu"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </>
                  )}
                  <label style={{ color: BLUE_DARK, fontWeight: "bold" }}>Vai trò</label>
                  <select
                    style={styles.select}
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="admin">Admin</option>
                    <option value="leader">Leader</option>
                    <option value="member">Member</option>
                  </select>
                  <label style={{ color: BLUE_DARK, fontWeight: "bold" }}>Trạng thái</label>
                  <select
                    style={styles.select}
                    value={formData.isActive}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                  <button style={styles.saveButton} onClick={handleSave}>
                    {editingUser ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "clubs" && (
          <>
            <div style={styles.card}>
              <div style={styles.cardIcon}>
                <Layers size={28} />
              </div>
              <div style={styles.cardContent}>
                <div style={styles.cardTitle}>Quản lý câu lạc bộ</div>
                <div style={styles.cardDesc}>
                  Tạo/sửa/xóa câu lạc bộ, gán trưởng câu lạc bộ.
                </div>
              </div>
            </div>
            <button style={styles.addButton} onClick={handleAddClub}>
              <Plus size={18} /> Thêm câu lạc bộ
            </button>
            <div style={styles.tableWrap}>
              {clubLoading ? (
                <p style={{ padding: 24 }}>Đang tải...</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Tên CLB</th>
                      <th style={styles.th}>Mô tả</th>
                      <th style={styles.th}>Trưởng CLB</th>
                      <th style={styles.th}>Ngày tạo</th>
                      <th style={styles.th}>Ngày cập nhật</th>
                      <th style={styles.th}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clubs.map((club) => (
                      <tr key={club.clubId}>
                        <td style={styles.td}>{club.clubId}</td>
                        <td style={styles.td}>{club.clubName}</td>
                        <td style={styles.td}>{club.description}</td>
                        <td style={styles.td}>{club.leaderName}</td>
                        <td style={styles.td}>
                          {club.createdAt
                            ? new Date(club.createdAt).toLocaleString()
                            : ""}
                        </td>
                        <td style={styles.td}>
                          {club.updatedAt
                            ? new Date(club.updatedAt).toLocaleString()
                            : ""}
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.actionButton(BLUE_DARK)}
                            onClick={() => handleEditClub(club)}
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            style={styles.actionButton("#ef4444")}
                            onClick={() => handleDeleteClub(club.clubId)}
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {showClubModal && (
              <div style={styles.modalOverlay}>
                <div style={styles.modal}>
                  <button
                    style={styles.closeButton}
                    onClick={() => setShowClubModal(false)}
                  >
                    <X />
                  </button>
                  <div style={styles.modalTitle}>
                    {editingClub ? "Sửa câu lạc bộ" : "Thêm câu lạc bộ"}
                  </div>
                  <label style={{ color: BLUE_DARK, fontWeight: "bold" }}>Tên câu lạc bộ</label>
                  <input
                    style={styles.input}
                    placeholder="Nhập tên câu lạc bộ"
                    value={clubForm.clubName}
                    onChange={(e) =>
                      setClubForm({ ...clubForm, clubName: e.target.value })
                    }
                  />
                  <label style={{ color: BLUE_DARK, fontWeight: "bold" }}>Mô tả</label>
                  <input
                    style={styles.input}
                    placeholder="Nhập mô tả"
                    value={clubForm.description}
                    onChange={(e) =>
                      setClubForm({ ...clubForm, description: e.target.value })
                    }
                  />
                  {editingClub && (
                    <>
                      <label style={{ color: BLUE_DARK, fontWeight: "bold" }}>Trưởng CLB</label>
                      <select
                        style={styles.select}
                        value={clubForm.leaderId}
                        onChange={(e) =>
                          setClubForm({ ...clubForm, leaderId: e.target.value })
                        }
                      >
                        <option value="">-- Chọn trưởng CLB --</option>
                        {users
                          .filter((u) => u.role === "leader" || u.role === "admin")
                          .map((u) => (
                            <option key={u.userId} value={u.userId}>
                              {u.fullName} ({u.email})
                            </option>
                          ))}
                      </select>
                    </>
                  )}
                  <button style={styles.saveButton} onClick={handleSaveClub}>
                    {editingClub ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "interviews" && (
          <>
            <div style={styles.card}>
              <div style={styles.cardIcon}>
                <ClipboardList size={28} />
              </div>
              <div style={styles.cardContent}>
                <div style={styles.cardTitle}>Quản lý phỏng vấn</div>
                <div style={styles.cardDesc}>
                  Quản lý danh sách phỏng vấn ứng viên cho từng câu lạc bộ.
                </div>
              </div>
            </div>
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
              <button style={styles.addButton} onClick={handleAddInterview}>
                <Plus size={18} /> Thêm phỏng vấn
              </button>
            </div>
            <div style={styles.tableWrap}>
              {interviewLoading ? (
                <p style={{ padding: 24 }}>Đang tải...</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Tên ứng viên</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Đánh giá</th>
                      <th style={styles.th}>Kết quả</th>
                      <th style={styles.th}>Ngày tạo</th>
                      <th style={styles.th}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviews.map((iv) => (
                      <tr key={iv.interviewId}>
                        <td style={styles.td}>{iv.interviewId}</td>
                        <td style={styles.td}>{iv.applicantName}</td>
                        <td style={styles.td}>{iv.applicantEmail}</td>
                        <td style={styles.td}>{iv.evaluation}</td>
                        <td style={styles.td}>{iv.result}</td>
                        <td style={styles.td}>
                          {iv.createdAt
                            ? new Date(iv.createdAt).toLocaleString()
                            : ""}
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.actionButton(BLUE_DARK)}
                            onClick={() => handleEditInterview(iv)}
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderDashboard;
