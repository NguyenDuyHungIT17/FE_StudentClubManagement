import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { photoService } from "../services/photoService"; // 👉 GỌI SERVICE ẢNH

export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State chung
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);

  // Data State
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [clubMembers, setClubMembers] = useState([]);
  const [events, setEvents] = useState([]); // 👉 Thêm events

  // Selection & Filter State
  const [selectedClubId, setSelectedClubId] = useState("");
  const [selectedMemberClubId, setSelectedMemberClubId] = useState("");
  const [userFilterRole, setUserFilterRole] = useState("all");
  const [interviewFilterResult, setInterviewFilterResult] = useState("all");

  // --- MODAL STATES ---
  // Users
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ fullName: "", email: "", password: "", role: "member", isActive: 1, clubId: "", uploadFiles: [] });
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  // Clubs
  const [showClubModal, setShowClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [clubForm, setClubForm] = useState({ clubName: "", title: "", description: "", leaderId: "", uploadFiles: [] });
  const [showViewClubModal, setShowViewClubModal] = useState(false);
  const [viewingClub, setViewingClub] = useState(null);

  // Events
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ clubId: "", title: "", description: "", eventDate: "", isPrivate: "true", priority: 1, uploadFiles: [] });
  const [showViewEventModal, setShowViewEventModal] = useState(false);
  const [viewingEvent, setViewingEvent] = useState(null);

  // Members
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({ clubId: "", userId: "", memberRole: "member", joinAt: "", uploadFiles: [] });
  const [showViewMemberModal, setShowViewMemberModal] = useState(false);
  const [viewingMember, setViewingMember] = useState(null);

  // Interviews
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ clubId: "", applicantName: "", applicantEmail: "", applicantPhone: "", interviewDate: "", result: "Pending" });
  const [showViewInterviewModal, setShowViewInterviewModal] = useState(false);
  const [viewingInterview, setViewingInterview] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // --- FETCHING LOGIC ---
  useEffect(() => {
    fetchUsers();
    fetchClubs();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (activeTab === "interviews" && selectedClubId) fetchInterviews(selectedClubId);
  }, [activeTab, selectedClubId]);

  useEffect(() => {
    if (activeTab === "members" && selectedMemberClubId) fetchClubMembers(selectedMemberClubId);
  }, [activeTab, selectedMemberClubId]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7251/api/Users", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setUsers(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchClubs = async () => {
    try {
      const res = await fetch("https://localhost:7251/api/Clubs", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setClubs(data);
        if (data.length > 0 && !selectedClubId) setSelectedClubId(data[0].clubId);
      }
    } catch (e) { console.error(e); }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://localhost:7251/api/Event", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setEvents(data?.data || data?.items || data || []);
      }
    } catch (e) { console.error(e); }
  };

  const fetchInterviews = async (cId) => {
    setLoading(true);
    try {
      const res = await fetch(`https://localhost:7251/api/Interviews/club/${cId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setInterviews(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchClubMembers = async (cId) => {
    if (!cId) return;
    setLoading(true);
    try {
      const res = await fetch(`https://localhost:7251/api/ClubMembers/club/${cId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setClubMembers(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };


  // --- HANDLERS (CRUD & VIEW) ---

  // ================= USERS =================
  const openAddUser = () => { 
    setEditingUser(null); 
    setUserForm({ fullName: "", email: "", password: "", role: "member", isActive: 1, clubId: "", uploadFiles: [] }); 
    setShowUserModal(true); 
  };
  
  const openEditUser = (u) => { 
    setEditingUser(u.userId); 
    setUserForm({ ...u, password: "", clubId: u.clubId || "", uploadFiles: [] }); 
    setShowUserModal(true); 
  };
  
  const viewUser = (u) => { 
    setViewingUser(u); 
    setShowViewUserModal(true); 
  };
  
  const saveUser = async () => {
    setLoading(true);
    try {
      let currentUserId = editingUser;
      const payload = {
        fullName: userForm.fullName,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        isActive: userForm.isActive,
        clubId: userForm.clubId ? parseInt(userForm.clubId) : null
      };

      if (editingUser) {
        const res = await fetch(`https://localhost:7251/api/Users/${editingUser}`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
          body: JSON.stringify(payload) 
        });
        if (!res.ok) throw new Error("Cập nhật thất bại!");
      } else {
        const res = await fetch("https://localhost:7251/api/Users", { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
          body: JSON.stringify(payload) 
        });
        if (!res.ok) throw new Error("Tạo tài khoản thất bại!");
        
        const data = await res.json();
        // 👉 Cải tiến: Bao trọn mọi loại format response từ C#
        currentUserId = data?.value?.userId || data?.data?.userId || data?.userId || data?.id;
      }

      // Vòng lặp upload ảnh User
      if (userForm.uploadFiles && userForm.uploadFiles.length > 0) {
        for (let i = 0; i < userForm.uploadFiles.length; i++) {
          const formData = new FormData();
          formData.append("File", userForm.uploadFiles[i]);
          formData.append("Title", `Ảnh đại diện ${userForm.fullName}`);
          formData.append("Type", "1"); // Ảnh user luôn là Main
          formData.append("UserId", currentUserId);
          await photoService.upload(formData);
        }
      }

      alert(editingUser ? "Cập nhật tài khoản thành công!" : "Tạo tài khoản thành công!");
      setShowUserModal(false);
      fetchUsers();
    } catch (e) { 
      alert("Lỗi: " + e.message); 
    } finally { 
      setLoading(false); 
    }
  };
  
  const deleteUser = async (id) => { 
    if (!window.confirm("Chắc chắn xóa người dùng này?")) return;
    try {
      await fetch(`https://localhost:7251/api/Users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
    } catch (e) { alert("Lỗi xóa"); }
  };

  // ================= CLUBS =================
  const openAddClub = () => { 
    setEditingClub(null); 
    setClubForm({ clubName: "", title: "", description: "", leaderId: "", uploadFiles: [] }); 
    setShowClubModal(true); 
  };
  
  const openEditClub = (c) => { 
    setEditingClub(c.clubId); 
    setClubForm({ ...c, leaderId: c.leaderId || "", uploadFiles: [] }); 
    setShowClubModal(true); 
  };
  
  const viewClub = (c) => { 
    setViewingClub(c); 
    setShowViewClubModal(true); 
  };

  const saveClub = async () => {
    setLoading(true);
    try {
      let currentClubId = editingClub;
      const payload = {
        clubName: clubForm.clubName,
        title: clubForm.title,
        description: clubForm.description,
        leaderId: clubForm.leaderId ? parseInt(clubForm.leaderId) : null
      };

      if (editingClub) {
        const res = await fetch(`https://localhost:7251/api/Clubs/${editingClub}`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
          body: JSON.stringify(payload) 
        });
        if (!res.ok) throw new Error("Cập nhật CLB thất bại!");
      } else {
        const res = await fetch("https://localhost:7251/api/Clubs", { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
          body: JSON.stringify(payload) 
        });
        if (!res.ok) throw new Error("Tạo CLB thất bại!");
        
        const data = await res.json();
        currentClubId = data?.value?.clubId || data?.data?.clubId || data?.clubId || data?.id;
      }

      // Vòng lặp upload ảnh Club
      if (clubForm.uploadFiles && clubForm.uploadFiles.length > 0) {
        for (let i = 0; i < clubForm.uploadFiles.length; i++) {
          const formData = new FormData();
          formData.append("File", clubForm.uploadFiles[i]);
          formData.append("Title", `${clubForm.clubName} - Ảnh ${i + 1}`);
          formData.append("Type", i === 0 ? "1" : "3"); // Ảnh 1 là Main, còn lại là Side
          formData.append("ClubId", currentClubId);
          await photoService.upload(formData);
        }
      }

      alert(editingClub ? "Cập nhật CLB thành công!" : "Tạo CLB và tải ảnh thành công!");
      setShowClubModal(false);
      fetchClubs();
    } catch (e) { 
      alert("Lỗi: " + e.message); 
    } finally { 
      setLoading(false); 
    }
  };
  
  const deleteClub = (id) => alert(`Chức năng xóa Club ID ${id} cần cẩn thận vì dính dữ liệu liên quan!`);


  // ================= EVENTS =================
  const openAddEvent = () => { 
    setEditingEvent(null); 
    setEventForm({ clubId: "", title: "", description: "", eventDate: "", isPrivate: "true", priority: 1, uploadFiles: [] }); 
    setShowEventModal(true); 
  };
  
  const openEditEvent = (e) => { 
    setEditingEvent(e.id); 
    setEventForm({ ...e, isPrivate: e.isPrivate ? "true" : "false", uploadFiles: [] }); 
    setShowEventModal(true); 
  };
  
  const viewEvent = (e) => { 
    setViewingEvent(e); 
    setShowViewEventModal(true); 
  };

  const saveEvent = async () => {
    setLoading(true);
    try {
      let currentEventId = editingEvent;
      const payload = {
        clubId: parseInt(eventForm.clubId),
        title: eventForm.title,
        description: eventForm.description,
        eventDate: eventForm.eventDate,
        isPrivate: eventForm.isPrivate === "true",
        priority: parseInt(eventForm.priority)
      };

      if (editingEvent) {
        const res = await fetch(`https://localhost:7251/api/Event/${editingEvent}`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
          body: JSON.stringify(payload) 
        });
        if (!res.ok) throw new Error("Cập nhật sự kiện thất bại!");
      } else {
        const res = await fetch("https://localhost:7251/api/Event", { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
          body: JSON.stringify(payload) 
        });
        if (!res.ok) throw new Error("Tạo sự kiện thất bại!");
        
        const data = await res.json();
        currentEventId = data?.value?.id || data?.data?.id || data?.id;
      }

      // Vòng lặp upload ảnh Event
      if (eventForm.uploadFiles && eventForm.uploadFiles.length > 0) {
        for (let i = 0; i < eventForm.uploadFiles.length; i++) {
          const formData = new FormData();
          formData.append("File", eventForm.uploadFiles[i]);
          formData.append("Title", `${eventForm.title} - Ảnh ${i + 1}`);
          formData.append("Type", i === 0 ? "2" : "3"); // Ảnh 1 là Cover, còn lại Side
          formData.append("EventId", currentEventId);
          await photoService.upload(formData);
        }
      }

      alert("Lưu sự kiện thành công!");
      setShowEventModal(false);
      fetchEvents();
    } catch (e) { 
      alert("Lỗi: " + e.message); 
    } finally { 
      setLoading(false); 
    }
  };
  
  const deleteEvent = async (id) => { alert(`Delete Event ${id}`); };


  // ================= CLUB MEMBERS =================
  const openAddMember = () => { 
    setEditingMember(null); 
    setMemberForm({ clubId: "", userId: "", memberRole: "member", joinAt: "", uploadFiles: [] }); 
    setShowMemberModal(true); 
  };
  
  const openEditMember = (m) => { 
    setEditingMember(m.clubMemberId); 
    setMemberForm({ ...m, uploadFiles: [] }); 
    setShowMemberModal(true); 
  };
  
  const viewMember = (m) => { 
    setViewingMember(m); 
    setShowViewMemberModal(true); 
  };

  const saveMember = async () => {
    setLoading(true);
    try {
      let currentMemberId = editingMember;
      const payload = {
        clubId: parseInt(memberForm.clubId),
        userId: parseInt(memberForm.userId),
        memberRole: memberForm.memberRole,
        joinAt: memberForm.joinAt || new Date().toISOString()
      };

      if (editingMember) {
        const res = await fetch(`https://localhost:7251/api/ClubMembers/${editingMember}`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
          body: JSON.stringify(payload) 
        });
        if (!res.ok) throw new Error("Cập nhật thành viên thất bại!");
      } else {
        const res = await fetch("https://localhost:7251/api/ClubMembers", { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
          body: JSON.stringify(payload) 
        });
        if (!res.ok) throw new Error("Thêm thành viên thất bại!");
        
        const data = await res.json();
        currentMemberId = data?.value?.clubMemberId || data?.data?.clubMemberId || data?.clubMemberId || data?.id;
      }

      // Vòng lặp upload ảnh thẻ (Member Card)
      if (memberForm.uploadFiles && memberForm.uploadFiles.length > 0) {
        for (let i = 0; i < memberForm.uploadFiles.length; i++) {
          const formData = new FormData();
          formData.append("File", memberForm.uploadFiles[i]);
          formData.append("Title", `Ảnh thẻ thành viên #${currentMemberId}`);
          formData.append("Type", "1"); // Main
          formData.append("ClubMemberId", currentMemberId);
          await photoService.upload(formData);
        }
      }

      alert("Lưu thành viên thành công!");
      setShowMemberModal(false);
      fetchClubMembers(selectedMemberClubId);
    } catch (e) { 
      alert("Lỗi: " + e.message); 
    } finally { 
      setLoading(false); 
    }
  };
  
  const deleteMember = (id) => alert(`Delete Member ${id}`);

  // ================= INTERVIEWS & EMAIL =================
  const saveInterview = async () => { alert("Save Interview"); setShowInterviewModal(false); };
  const deleteInterview = (id) => alert(`Delete Interview ${id}`);
  const sendEmail = async (type) => { 
      setEmailSending(true); 
      setTimeout(() => { setEmailResult({success:true, message:"Email sent"}); setEmailSending(false); setShowResultModal(true); setShowEmailModal(false); }, 1000); 
  };


  // EXPORT TẤT CẢ
  return {
    navigate, token, loading,
    activeTab, setActiveTab,
    users, clubs, interviews, clubMembers, events,
    selectedClubId, setSelectedClubId, selectedMemberClubId, setSelectedMemberClubId,
    userFilterRole, setUserFilterRole, interviewFilterResult, setInterviewFilterResult,
    
    showUserModal, setShowUserModal, showViewUserModal, setShowViewUserModal,
    showClubModal, setShowClubModal, showViewClubModal, setShowViewClubModal,
    showInterviewModal, setShowInterviewModal, showViewInterviewModal, setShowViewInterviewModal,
    showMemberModal, setShowMemberModal, showViewMemberModal, setShowViewMemberModal,
    showEventModal, setShowEventModal, showViewEventModal, setShowViewEventModal, 
    showEmailModal, setShowEmailModal, showResultModal, setShowResultModal,

    userForm, setUserForm, viewingUser, editingUser,
    clubForm, setClubForm, viewingClub, editingClub,
    interviewForm, setInterviewForm, viewingInterview, editingInterview, emailResult, emailSending,
    memberForm, setMemberForm, viewingMember, editingMember,
    eventForm, setEventForm, viewingEvent, editingEvent, 

    openAddUser, openEditUser, saveUser, deleteUser, viewUser,
    openAddClub, openEditClub, saveClub, deleteClub, viewClub,
    openAddMember, openEditMember, saveMember, deleteMember, viewMember, 
    openAddEvent, openEditEvent, saveEvent, deleteEvent, viewEvent, 
    saveInterview, deleteInterview, sendEmail
  };
};