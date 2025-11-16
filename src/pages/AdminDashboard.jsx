import React, { useState, useEffect } from "react";
import { Users, Layers, ClipboardList, Plus, Edit, Trash2, X, Eye, Mail, CheckCircle, AlertCircle } from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const ORANGE = "#fb923c";
const ORANGE_DARK = "#ea580c";
const BG = "#fff7ed";
const BORDER = "#fed7aa";
const TEXT = "#1f2937";
const CARD = "#fff";
const CARD_SHADOW = "0 2px 16px #fb923c22";
const ACCENT = "#f59e42";
const ACCENT_BG = "#fffbe6";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clubLoading, setClubLoading] = useState(true);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  // User states
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userFilterRole, setUserFilterRole] = useState("all");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "member",
    isActive: 1,
  });
  const [viewingUser, setViewingUser] = useState(null);
  const [showViewUserModal, setShowViewUserModal] = useState(false);

  // Club states
  const [showClubModal, setShowClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [clubForm, setClubForm] = useState({
    clubName: "",
    description: "",
    leaderId: "",
  });
  const [viewingClub, setViewingClub] = useState(null);
  const [showViewClubModal, setShowViewClubModal] = useState(false);

  // Interview states
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [interviewFilterResult, setInterviewFilterResult] = useState("all");
  const [interviewForm, setInterviewForm] = useState({
    clubId: "",
    applicantName: "",
    applicantEmail: "",
    evaluation: "",
    result: "Pending",
  });
  const [selectedClubId, setSelectedClubId] = useState("");
  const [viewingInterview, setViewingInterview] = useState(null);
  const [showViewInterviewModal, setShowViewInterviewModal] = useState(false);

  // Email states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
 
  // Filter functions
  const filteredUsers = userFilterRole === "all" 
    ? users 
    : users.filter(user => user.role === userFilterRole);

  const filteredInterviews = interviewFilterResult === "all"
    ? interviews
    : interviews.filter(iv => iv.result === interviewFilterResult);
  useEffect(() => {
    fetchUsers();
    fetchClubs();
  }, []);

  useEffect(() => {
    if (activeTab === "interviews" && selectedClubId) {
      fetchInterviews(selectedClubId);
    }
    // eslint-disable-next-line
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

  // View User Details
  const handleViewUser = async (userId) => {
    try {
      const res = await fetch(`https://localhost:7251/api/Users/${userId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy thông tin người dùng");
      const data = await res.json();
      setViewingUser({ userId, ...data });
      setShowViewUserModal(true);
    } catch (err) {
      alert(err.message);
    }
  };

  // View Club Details
  const handleViewClub = async (clubId) => {
    try {
      const res = await fetch(`https://localhost:7251/api/Clubs/${clubId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy thông tin câu lạc bộ");
      const data = await res.json();
      setViewingClub(data);
      setShowViewClubModal(true);
    } catch (err) {
      alert(err.message);
    }
  };

  // View Interview Details
  const handleViewInterview = async (interviewId) => {
    try {
      const res = await fetch(`https://localhost:7251/api/Interviews/${interviewId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy thông tin phỏng vấn");
      const data = await res.json();
      setViewingInterview(data);
      setShowViewInterviewModal(true);
    } catch (err) {
      alert(err.message);
    }
  };

  // Send Email for Pass/Fail
  const handleSendEmail = async (resultType) => {
    if (!window.confirm(`Bạn có chắc chắn muốn gửi email cho các bạn ${resultType}?`)) return;
    
    setEmailSending(true);
    try {
      const res = await fetch(
        `https://localhost:7251/api/Interviews/club/${selectedClubId}/send-email/${resultType}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errData = await res.text();
        let errorMessage = "Lỗi khi gửi email";
        try {
          const jsonError = JSON.parse(errData);
          errorMessage = jsonError.message || errorMessage;
        } catch {
          errorMessage = errData || errorMessage;
        }
        setEmailResult({
          success: false,
          message: errorMessage,
          resultType: resultType,
        });
      } else {
        const responseText = await res.text();
        let message = "Gửi email thành công!";
        
        try {
          const jsonData = JSON.parse(responseText);
          message = jsonData.message || jsonData || "Gửi email thành công!";
        } catch {
          message = responseText || "Gửi email thành công!";
        }

        setEmailResult({
          success: true,
          message: message,
          resultType: resultType,
        });
      }
      setShowResultModal(true);
      setShowEmailModal(false);
    } catch (err) {
      setEmailResult({
        success: false,
        message: err.message || "Lỗi kết nối đến máy chủ",
        resultType: resultType,
      });
      setShowResultModal(true);
      setShowEmailModal(false);
    } finally {
      setEmailSending(false);
    }
  };

  const handleResultOk = () => {
    setShowResultModal(false);
    setEmailResult(null);
    fetchInterviews(selectedClubId);
  };

  // User CRUD
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ fullName: "", email: "", password: "", clubId: "", role: "member", isActive: 1 });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user.userId);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "",
      clubId: user.clubId || "",
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
      if (!formData.fullName.trim()) {
        alert("Vui lòng nhập họ tên");
        return;
      }
      if (!formData.email.trim()) {
        alert("Vui lòng nhập email");
        return;
      }
      if (!editingUser && !formData.password) {
        alert("Vui lòng nhập mật khẩu");
        return;
      }

      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `https://localhost:7251/api/Users/${editingUser}`
        : "https://localhost:7251/api/Users";

      let dataToSend = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        clubId: formData.clubId ? parseInt(formData.clubId, 10) : null,
        role: formData.role,
        isActive: formData.isActive,
      };

      if (!editingUser) {
        dataToSend.password = formData.password;
      } else if (formData.password) {
        dataToSend.password = formData.password;
      }

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

  // Club CRUD
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

  // Interview CRUD
  const handleAddInterview = () => {
    navigate("/admin/interview/add", { state: { clubId: selectedClubId } });
  };

  const handleEditInterview = (interview) => {
    setEditingInterview(interview.interviewId);
    setInterviewForm({
      clubId: interview.clubId,
      applicantName: interview.applicantName,
      applicantEmail: interview.applicantEmail,
      evaluation: interview.evaluation,
      result: interview.result || "Pending",
    });
    setShowInterviewModal(true);
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phỏng vấn này?")) return;
    try {
      const res = await fetch(`https://localhost:7251/api/Interviews/${interviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Lỗi khi xóa phỏng vấn");
      alert("Xóa thành công!");
      fetchInterviews(selectedClubId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveInterview = async () => {
    try {
      if (!interviewForm.applicantName.trim()) {
        alert("Vui lòng nhập tên ứng viên");
        return;
      }
      if (!interviewForm.applicantEmail.trim()) {
        alert("Vui lòng nhập email ứng viên");
        return;
      }
      if (!interviewForm.evaluation.trim()) {
        alert("Vui lòng nhập đánh giá");
        return;
      }

      const method = editingInterview ? "PUT" : "POST";
      const url = editingInterview
        ? `https://localhost:7251/api/Interviews/${editingInterview}`
        : "https://localhost:7251/api/Interviews";

      const dataToSend = {
        clubId: parseInt(selectedClubId),
        applicantName: interviewForm.applicantName.trim(),
        applicantEmail: interviewForm.applicantEmail.trim(),
        evaluation: interviewForm.evaluation.trim(),
        result: interviewForm.result,
      };

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Lỗi khi lưu phỏng vấn");
      }

      alert(editingInterview ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setShowInterviewModal(false);
      setEditingInterview(null);
      setInterviewForm({
        clubId: "",
        applicantName: "",
        applicantEmail: "",
        evaluation: "",
        result: "Pending",
      });
      fetchInterviews(selectedClubId);
    } catch (err) {
      alert(err.message);
    }
  };

  // UI styles
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
      background: ORANGE,
      borderBottom: `2px solid ${BORDER}`,
      borderRadius: "0 0 24px 24px",
      boxShadow: "0 2px 8px #fb923c22",
      marginBottom: 32,
      gap: 18,
      width: "100%",
      boxSizing: "border-box",
    },
    logo: { width: 48, height: 48, borderRadius: 12, background: "#fff" },
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
      background: active ? ORANGE_DARK : "#fff",
      color: active ? "#fff" : ORANGE_DARK,
      border: `1.5px solid ${BORDER}`,
      borderRadius: 12,
      padding: "8px 18px",
      fontWeight: "bold",
      fontSize: 16,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 8,
      boxShadow: active ? "0 2px 8px #fb923c22" : "none",
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
      background: ORANGE,
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
      color: ORANGE_DARK,
      marginBottom: 6,
    },
    cardDesc: { fontSize: 15, color: "#7c4700" },
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
      boxShadow: "0 2px 8px #fb923c22",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "background 0.2s",
    },
    emailButton: {
      background: "#10b981",
      color: "#fff",
      border: "none",
      padding: "10px 18px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
      marginBottom: "15px",
      marginLeft: "8px",
      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
      display: "flex",
      alignItems: "center",
      gap: "6px",
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
      color: ORANGE_DARK,
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
      padding: "28px",
      width: "520px",
      maxHeight: "90vh",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      position: "relative",
      boxShadow: CARD_SHADOW,
      border: `2px solid ${ACCENT}`,
    },
    viewModal: {
      background: ACCENT_BG,
      borderRadius: "18px",
      padding: "28px",
      width: "600px",
      maxHeight: "90vh",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      position: "relative",
      boxShadow: CARD_SHADOW,
      border: `2px solid ${ACCENT}`,
    },
    emailModal: {
      background: ACCENT_BG,
      borderRadius: "18px",
      padding: "28px",
      width: "450px",
      maxHeight: "90vh",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      position: "relative",
      boxShadow: CARD_SHADOW,
      border: `2px solid ${ACCENT}`,
    },
    resultModal: {
      background: ACCENT_BG,
      borderRadius: "18px",
      padding: "32px",
      width: "480px",
      maxHeight: "90vh",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      position: "relative",
      boxShadow: CARD_SHADOW,
      border: `2px solid ${ACCENT}`,
      textAlign: "center",
    },
    resultIcon: (success) => ({
      fontSize: 64,
      color: success ? "#10b981" : "#ef4444",
      marginBottom: 8,
      display: "flex",
      justifyContent: "center",
    }),
    resultTitle: (success) => ({
      fontWeight: "bold",
      fontSize: "24px",
      color: success ? "#10b981" : "#ef4444",
      marginBottom: 8,
      letterSpacing: 1,
    }),
    resultMessage: {
      fontSize: "16px",
      color: TEXT,
      lineHeight: "1.6",
      marginBottom: 12,
      wordBreak: "break-word",
      padding: "12px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      border: `1px solid ${BORDER}`,
    },
    resultButton: (success) => ({
      background: success ? "#10b981" : "#ef4444",
      color: "#fff",
      border: "none",
      padding: "14px 24px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      boxShadow: `0 2px 8px ${success ? "#10b981" : "#ef4444"}33`,
      letterSpacing: 1,
      transition: "background 0.2s",
      marginTop: 12,
    }),
    input: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: `2px solid ${ACCENT}`,
      fontSize: "15px",
      outline: "none",
      background: "#fff",
      marginBottom: "8px",
      color: TEXT,
      fontWeight: "500",
      transition: "border 0.2s",
      width: "100%",
      boxSizing: "border-box",
      fontFamily: "inherit",
    },
    textarea: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: `2px solid ${ACCENT}`,
      fontSize: "15px",
      outline: "none",
      background: "#fff",
      marginBottom: "8px",
      color: TEXT,
      fontWeight: "500",
      transition: "border 0.2s",
      width: "100%",
      boxSizing: "border-box",
      fontFamily: "inherit",
      minHeight: "100px",
      resize: "vertical",
    },
    select: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: `2px solid ${ACCENT}`,
      fontSize: "15px",
      background: "#fff",
      color: ORANGE_DARK,
      fontWeight: "500",
      marginBottom: "8px",
      transition: "border 0.2s",
      width: "100%",
      boxSizing: "border-box",
      fontFamily: "inherit",
    },
    saveButton: {
      background: ORANGE_DARK,
      color: "#fff",
      border: "none",
      padding: "12px 20px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      marginTop: "16px",
      boxShadow: "0 2px 8px #fb923c22",
      letterSpacing: 1,
      transition: "background 0.2s",
      width: "100%",
      boxSizing: "border-box",
    },
    emailButtonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "12px",
    },
    emailActionButton: (bgColor) => ({
      flex: 1,
      background: bgColor,
      color: "#fff",
      border: "none",
      padding: "12px 16px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      boxShadow: `0 2px 8px ${bgColor}33`,
      letterSpacing: 0.5,
      transition: "opacity 0.2s",
      opacity: emailSending ? 0.6 : 1,
      pointerEvents: emailSending ? "none" : "auto",
    }),
    modalLabel: {
      color: ORANGE_DARK,
      fontWeight: "bold",
      fontSize: "14px",
      marginTop: "6px",
      marginBottom: "4px",
      letterSpacing: 0.5,
    },
    closeButton: {
      position: "absolute",
      top: "12px",
      right: "12px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: ORANGE_DARK,
      fontSize: 22,
      padding: "4px",
    },
    modalTitle: {
      fontWeight: "bold",
      fontSize: "20px",
      color: ORANGE_DARK,
      marginBottom: "12px",
      textAlign: "center",
      letterSpacing: 1,
      paddingRight: "24px",
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
      boxShadow: "0 2px 8px #fb923c22",
    },
    filterLabel: {
      fontWeight: "bold",
      color: ORANGE_DARK,
      fontSize: 16,
      letterSpacing: 1,
    },
    viewItem: {
      padding: "12px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      border: `1px solid ${BORDER}`,
      marginBottom: "12px",
    },
    viewLabel: {
      color: ORANGE_DARK,
      fontWeight: "bold",
      fontSize: "13px",
      marginBottom: "4px",
      letterSpacing: 0.5,
    },
    viewValue: {
      color: TEXT,
      fontSize: "15px",
      wordBreak: "break-word",
    },
  };

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <span style={styles.title}>STUDENT CLUB ADMIN</span>
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
        {/* USERS */}
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
            
            <div style={styles.filterRow}>
              <span style={styles.filterLabel}>Lọc theo vai trò:</span>
              <select
                id="filterRole"
                name="filterRole"
                style={styles.select}
                value={userFilterRole}
                onChange={(e) => setUserFilterRole(e.target.value)}
              >
                <option value="all">-- Tất cả --</option>
                <option value="admin">Admin</option>
                <option value="leader">Leader</option>
                <option value="member">Member</option>
              </select>
              <button style={styles.addButton} onClick={handleAdd}>
                <Plus size={18} /> Thêm mới
              </button>
            </div>

            <div style={styles.tableWrap}>
              {loading ? (
                <p style={{ padding: 24 }}>Đang tải...</p>
              ) : filteredUsers.length === 0 ? (
                <p style={{ padding: 24, textAlign: "center", color: "#999" }}>
                  Không có tài khoản nào phù hợp
                </p>
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
                    {filteredUsers.map((user) => (
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
                            style={styles.actionButton("#2563eb")}
                            onClick={() => handleViewUser(user.userId)}
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            style={styles.actionButton(ORANGE_DARK)}
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
                  <label style={styles.modalLabel}>Họ tên</label>
                  <input
                    id="fullName"
                    name="fullName"
                    style={styles.input}
                    placeholder="Nhập họ tên"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                  <label style={styles.modalLabel}>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    style={styles.input}
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {!editingUser && (
                    <>
                      <label style={styles.modalLabel}>Mật khẩu</label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        style={styles.input}
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </>
                  )}
                  <label style={styles.modalLabel}>Thuộc CLB</label>
                  <select
                    id="clubId"
                    name="clubId"
                    style={styles.select}
                    value={formData.clubId}
                    onChange={(e) =>
                      setFormData({ ...formData, clubId: e.target.value })
                    }
                  >
                    <option value="">-- Không chọn --</option>
                    {clubs.map((c) => (
                      <option key={c.clubId} value={c.clubId}>
                        {c.clubName}
                      </option>
                    ))}
                  </select>
                  <label style={styles.modalLabel}>Vai trò</label>
                  <select
                    id="role"
                    name="role"
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
                  <label style={styles.modalLabel}>Trạng thái</label>
                  <select
                    id="isActive"
                    name="isActive"
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
            {showViewUserModal && viewingUser && (
              <div style={styles.modalOverlay}>
                <div style={styles.viewModal}>
                  <button
                    style={styles.closeButton}
                    onClick={() => setShowViewUserModal(false)}
                  >
                    <X />
                  </button>
                  <div style={styles.modalTitle}>Chi tiết thông tin người dùng</div>
                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>ID</div>
                    <div style={styles.viewValue}>{viewingUser.userId}</div>
                  </div>
                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Họ tên</div>
                    <div style={styles.viewValue}>{viewingUser.fullName}</div>
                  </div>
                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Email</div>
                    <div style={styles.viewValue}>{viewingUser.email}</div>
                  </div>
                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Vai trò</div>
                    <div style={styles.viewValue}>{viewingUser.role}</div>
                  </div>
                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Trạng thái</div>
                    <div style={styles.viewValue}>
                      {viewingUser.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* CLUBS */}
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
                      <th style={styles.th}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clubs.map((club) => (
                      <tr key={club.clubId}>
                        <td style={styles.td}>{club.clubId}</td>
                        <td style={styles.td}>{club.clubName}</td>
                        <td style={styles.td}>{club.description?.substring(0, 30)}...</td>
                        <td style={styles.td}>{club.leaderName}</td>
                        <td style={styles.td}>
                          {club.createdAt
                            ? new Date(club.createdAt).toLocaleString()
                            : ""}
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.actionButton("#2563eb")}
                            onClick={() => handleViewClub(club.clubId)}
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            style={styles.actionButton(ORANGE_DARK)}
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
                  <label style={styles.modalLabel}>Tên câu lạc bộ</label>
                  <input
                    id="clubName"
                    name="clubName"
                    style={styles.input}
                    placeholder="Nhập tên câu lạc bộ"
                    value={clubForm.clubName}
                    onChange={(e) =>
                      setClubForm({ ...clubForm, clubName: e.target.value })
                    }
                  />
                  <label style={styles.modalLabel}>Mô tả</label>
                  <textarea
                    id="clubDesc"
                    name="description"
                    style={styles.textarea}
                    placeholder="Nhập mô tả"
                    value={clubForm.description}
                    onChange={(e) =>
                      setClubForm({ ...clubForm, description: e.target.value })
                    }
                  />
                  {editingClub && (
                    <>
                      <label style={styles.modalLabel}>Trưởng CLB</label>
                      <select
                        id="leaderId"
                        name="leaderId"
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
            {showViewClubModal && viewingClub && (
              <div style={styles.modalOverlay}>
                <div style={styles.viewModal}>
                  <button
                    style={styles.closeButton}
                    onClick={() => setShowViewClubModal(false)}
                  >
                    <X />
                  </button>
                  <div style={styles.modalTitle}>Chi tiết câu lạc bộ</div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>ID</div>
                    <div style={styles.viewValue}>{viewingClub.clubId}</div>
                  </div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Tên CLB</div>
                    <div style={styles.viewValue}>{viewingClub.clubName}</div>
                  </div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Mô tả</div>
                    <div style={styles.viewValue}>{viewingClub.description}</div>
                  </div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Trưởng CLB</div>
                    <div style={styles.viewValue}>{viewingClub.leaderName}</div>
                  </div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Ngày tạo</div>
                    <div style={styles.viewValue}>
                      {viewingClub.createdAt
                        ? new Date(viewingClub.createdAt).toLocaleString("vi-VN")
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* INTERVIEWS */}
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
                id="selectClub"
                name="selectClub"
                style={styles.select}
                value={selectedClubId}
                onChange={(e) => {
                  setSelectedClubId(e.target.value);
                  setInterviews([]);
                  setInterviewFilterResult("all");
                }}
              >
                {clubs.map((club) => (
                  <option key={club.clubId} value={club.clubId}>
                    {club.clubName}
                  </option>
                ))}
              </select>

              <span style={styles.filterLabel}>Lọc theo kết quả:</span>
              <select
                id="filterResult"
                name="filterResult"
                style={styles.select}
                value={interviewFilterResult}
                onChange={(e) => setInterviewFilterResult(e.target.value)}
              >
                <option value="all">-- Tất cả --</option>
                <option value="Pending">⏳ Pending</option>
                <option value="Pass">✓ Pass</option>
                <option value="Fail">✗ Fail</option>
              </select>

              <button style={styles.addButton} onClick={handleAddInterview}>
                <Plus size={18} /> Thêm phỏng vấn
              </button>
              <button style={styles.emailButton} onClick={() => setShowEmailModal(true)}>
                <Mail size={16} /> Gửi email
              </button>
            </div>

            <div style={styles.tableWrap}>
              {interviewLoading ? (
                <p style={{ padding: 24 }}>Đang tải...</p>
              ) : filteredInterviews.length === 0 ? (
                <p style={{ padding: 24, textAlign: "center", color: "#999" }}>
                  Không có phỏng vấn nào phù hợp
                </p>
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
                    {filteredInterviews.map((iv) => (
                      <tr key={iv.interviewId}>
                        <td style={styles.td}>{iv.interviewId}</td>
                        <td style={styles.td}>{iv.applicantName}</td>
                        <td style={styles.td}>{iv.applicantEmail}</td>
                        <td style={styles.td}>{iv.evaluation?.substring(0, 30)}...</td>
                        <td style={styles.td}>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            fontSize: "13px",
                            backgroundColor: 
                              iv.result === "Pass" ? "#d1fae5" :
                              iv.result === "Fail" ? "#fee2e2" :
                              "#fef3c7",
                            color:
                              iv.result === "Pass" ? "#065f46" :
                              iv.result === "Fail" ? "#7f1d1d" :
                              "#92400e"
                          }}>
                            {iv.result === "Pass" ? "✓ Pass" :
                             iv.result === "Fail" ? "✗ Fail" :
                             "⏳ Pending"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {iv.createdAt
                            ? new Date(iv.createdAt).toLocaleString()
                            : ""}
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.actionButton("#2563eb")}
                            onClick={() => handleViewInterview(iv.interviewId)}
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            style={styles.actionButton(ORANGE_DARK)}
                            onClick={() => handleEditInterview(iv)}
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            style={styles.actionButton("#ef4444")}
                            onClick={() => handleDeleteInterview(iv.interviewId)}
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

            {showInterviewModal && (
              <div style={styles.modalOverlay}>
                <div style={styles.modal}>
                  <button
                    style={styles.closeButton}
                    onClick={() => {
                      setShowInterviewModal(false);
                      setEditingInterview(null);
                    }}
                  >
                    <X />
                  </button>
                  <div style={styles.modalTitle}>
                    {editingInterview ? "Sửa phỏng vấn" : "Thêm phỏng vấn"}
                  </div>
                  <label style={styles.modalLabel}>Tên ứng viên</label>
                  <input
                    id="applicantName"
                    name="applicantName"
                    style={styles.input}
                    placeholder="Nhập tên ứng viên"
                    value={interviewForm.applicantName}
                    onChange={(e) =>
                      setInterviewForm({ ...interviewForm, applicantName: e.target.value })
                    }
                  />
                  <label style={styles.modalLabel}>Email ứng viên</label>
                  <input
                    id="applicantEmail"
                    name="applicantEmail"
                    type="email"
                    style={styles.input}
                    placeholder="Nhập email ứng viên"
                    value={interviewForm.applicantEmail}
                    onChange={(e) =>
                      setInterviewForm({ ...interviewForm, applicantEmail: e.target.value })
                    }
                  />
                  <label style={styles.modalLabel}>Đánh giá</label>
                  <textarea
                    id="evaluation"
                    name="evaluation"
                    style={styles.textarea}
                    placeholder="Nhập đánh giá ứng viên"
                    value={interviewForm.evaluation}
                    onChange={(e) =>
                      setInterviewForm({ ...interviewForm, evaluation: e.target.value })
                    }
                  />
                  <label style={styles.modalLabel}>Kết quả</label>
                  <select
                    id="result"
                    name="result"
                    style={styles.select}
                    value={interviewForm.result}
                    onChange={(e) =>
                      setInterviewForm({ ...interviewForm, result: e.target.value })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                  </select>
                  <button style={styles.saveButton} onClick={handleSaveInterview}>
                    {editingInterview ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </div>
            )}

            {showViewInterviewModal && viewingInterview && (
              <div style={styles.modalOverlay}>
                <div style={styles.viewModal}>
                  <button
                    style={styles.closeButton}
                    onClick={() => setShowViewInterviewModal(false)}
                  >
                    <X />
                  </button>
                  <div style={styles.modalTitle}>Chi tiết phỏng vấn</div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>ID Phỏng vấn</div>
                    <div style={styles.viewValue}>{viewingInterview.interviewId}</div>
                  </div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>ID CLB</div>
                    <div style={styles.viewValue}>{viewingInterview.clubId}</div>
                  </div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Tên ứng viên</div>
                    <div style={styles.viewValue}>{viewingInterview.applicantName}</div>
                  </div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Email</div>
                    <div style={styles.viewValue}>{viewingInterview.applicantEmail}</div>
                  </div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Đánh giá</div>
                    <div style={styles.viewValue}>{viewingInterview.evaluation}</div>
                  </div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Kết quả</div>
                    <div style={styles.viewValue}>{viewingInterview.result}</div>
                  </div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>Ngày tạo</div>
                    <div style={styles.viewValue}>
                      {viewingInterview.createdAt
                        ? new Date(viewingInterview.createdAt).toLocaleString("vi-VN")
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showEmailModal && (
              <div style={styles.modalOverlay}>
                <div style={styles.emailModal}>
                  <button
                    style={styles.closeButton}
                    onClick={() => setShowEmailModal(false)}
                  >
                    <X />
                  </button>
                  <div style={styles.modalTitle}>Gửi email cho ứng viên</div>

                  <div style={styles.viewItem}>
                    <div style={styles.viewLabel}>📧 Câu lạc bộ được chọn</div>
                    <div style={styles.viewValue}>
                      {clubs.find((c) => c.clubId === parseInt(selectedClubId))?.clubName}
                    </div>
                  </div>

                  <p style={{ color: TEXT, fontSize: "14px", lineHeight: "1.6" }}>
                    Chọn loại email bạn muốn gửi:
                  </p>

                  <div style={styles.emailButtonGroup}>
                    <button
                      style={styles.emailActionButton("#10b981")}
                      onClick={() => handleSendEmail("Pass")}
                      disabled={emailSending}
                    >
                      ✓ Gửi cho Pass
                    </button>
                    <button
                      style={styles.emailActionButton("#ef4444")}
                      onClick={() => handleSendEmail("Fail")}
                      disabled={emailSending}
                    >
                      ✗ Gửi cho Fail
                    </button>
                  </div>

                  {emailSending && (
                    <p style={{ textAlign: "center", color: ORANGE, fontSize: "14px" }}>
                      Đang gửi email... ⏳
                    </p>
                  )}
                </div>
              </div>
            )}

            {showResultModal && emailResult && (
              <div style={styles.modalOverlay}>
                <div style={styles.resultModal}>
                  <div style={styles.resultIcon(emailResult.success)}>
                    {emailResult.success ? (
                      <CheckCircle size={64} />
                    ) : (
                      <AlertCircle size={64} />
                    )}
                  </div>
                  
                  <div style={styles.resultTitle(emailResult.success)}>
                    {emailResult.success ? "Thành công! ✓" : "Có lỗi xảy ra! ✗"}
                  </div>

                  <div style={styles.resultMessage}>
                    {emailResult.message}
                  </div>

                  <button
                    style={styles.resultButton(emailResult.success)}
                    onClick={handleResultOk}
                  >
                    OK - Quay lại
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;