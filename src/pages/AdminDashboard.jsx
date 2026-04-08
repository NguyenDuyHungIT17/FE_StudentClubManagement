// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "../context/ThemeContext";

// Import Hooks chuẩn
import { useUsers } from "../hooks/useUsers";
import { useClubs } from "../hooks/useClubs";
import { useMembers } from "../hooks/useMembers";
import { useEvents } from "../hooks/useEvents";
import { useEventRegistrations } from "../hooks/useEventRegistrations";
import { useCampaigns } from "../hooks/useCampaigns"; // Đảm bảo import Hook này
import { useInterviews } from "../hooks/useInterviews";
import { useDashboardUI } from "../hooks/useDashboardUI";

// Import Services
import { photoService } from "../services/photoService";
import { userService } from "../services/userService";
import { clubService } from "../services/clubService";

// Styles
import "../styles/UniClubsTheme.css";

// Components Layout
import Sidebar from "../components/common/Sidebar";
import TopHeader from "../components/common/TopHeader";
import StatsSection from "../components/dashboard/StatsSection";

// Components Tables & Boards
import UsersTable from "../components/tables/UsersTable";
import ClubsTable from "../components/tables/ClubsTable";
import MembersTable from "../components/tables/MembersTable";
import EventsTable from "../components/tables/EventsTable";
import EventRegistrationsTable from "../components/tables/EventRegistrationsTable";
import CampaignsTable from "../components/tables/CampaignsTable"; // Đảm bảo import Component này
import InterviewBoard from "../components/interviews/InterviewBoard";

// Component Modals
import AdminDashboardModals from "../components/dashboard/AdminDashboardModals";

const DashboardContent = () => {

  const {
    users, createUser, updateUser, deleteUser, fetchUsers,
    keyword: userKeyword, setKeyword: setUserKeyword,
    filterRole: userFilterRole, setFilterRole: setUserFilterRole,
    filterIsActive: userFilterIsActive, setFilterIsActive: setUserFilterIsActive,
    page: userPage, setPage: setUserPage,
    paginationMeta: userPaginationMeta
  } = useUsers();

  const {
    registrations, createRegistration, updateRegistration, deleteRegistration,
    selectedEventId, setSelectedEventId,
    keyword: regKeyword, setKeyword: setRegKeyword,
    page: regPage, setPage: setRegPage,
    paginationMeta: regPaginationMeta
  } = useEventRegistrations();

  const {
    clubs, createClub, updateClub, deleteClub, fetchClubs,
    keyword, setKeyword, page, setPage, paginationMeta
  } = useClubs();

  const {
    members, createMember, updateMember, deleteMember, fetchMembers,
    filterClub: memberFilterClub, setFilterClub: setMemberFilterClub,
    filterRole: memberFilterRole, setFilterRole: setMemberFilterRole,
    page: memberPage, setPage: setMemberPage,
    paginationMeta: memberPaginationMeta
  } = useMembers();

  const {
    events, createEvent, updateEvent, deleteEvent, fetchEvents,
    keyword: eventKeyword, setKeyword: setEventKeyword,
    filterClub: eventFilterClub, setFilterClub: setEventFilterClub,
    filterIsPrivate: eventFilterIsPrivate, setFilterIsPrivate: setEventFilterIsPrivate,
    page: eventPage, setPage: setEventPage,
    paginationMeta: eventPaginationMeta
  } = useEvents();

  const {
    campaigns, createCampaign, updateCampaign, deleteCampaign, fetchCampaigns,
    keyword: campKeyword, setKeyword: setCampKeyword,
    filterClub: campFilterClub, setFilterClub: setCampFilterClub,
    filterIsActive: campFilterIsActive, setFilterIsActive: setCampFilterIsActive,
    page: campPage, setPage: setCampPage, paginationMeta: campPaginationMeta
  } = useCampaigns();

  const {
    interviews, fetchInterviews, keyword: intKeyword, setKeyword: setIntKeyword, filterClub: intFilterClub, setFilterClub: setIntFilterClub,
    filterStatus: intFilterStatus, setFilterStatus: setIntFilterStatus, filterResult: intFilterResult, setFilterResult: setIntFilterResult,
    createWalkIn, updateInterview, deleteInterview, checkIn, startInterview, finishInterview, noShow, cancelInterview, sendEmails,
    filterCampaign, setFilterCampaign,
    updateResultAfterInterview, getInterviewById
  } = useInterviews();

  // State cục bộ cho Interview
  const [isUpdatingResult, setIsUpdatingResult] = useState(false);
  const [leaderUsers, setLeaderUsers] = useState([]);
  const leadersFetchedRef = useRef(false); // 🚀 Prevent double fetch in StrictMode
  const lastFetchKeyRef = useRef(null); // 🚀 Prevent duplicate fetches for same query state

  const normalizeRole = (role) => String(role || "").trim().toLowerCase();
  const isLeaderRole = (role) => normalizeRole(role) === "leader" || normalizeRole(role) === "admin";
  const normalizeName = (name) =>
    String(name || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  // 🚀 Fetch leaders ONCE on mount, cache result
  useEffect(() => {
    if (leadersFetchedRef.current) return; // ✅ Skip if already fetched
    leadersFetchedRef.current = true;

    const loadLeaders = async () => {
      try {
        const response = await userService.getAll("", "all", 1, 200);
        const allUsers = response?.data || [];
        const leaders = allUsers.filter((u) => isLeaderRole(u.role));
        setLeaderUsers(leaders);
      } catch (err) {
        console.error("Lỗi tải danh sách trưởng CLB:", err);
        setLeaderUsers([]);
      }
    };
    loadLeaders();
  }, []); // Empty deps = run once on mount

  // 🚀 EAGER LOAD: Fetch shared data (clubs, events, members) on mount for dropdowns
  useEffect(() => {
    const loadSharedData = async () => {
      try {
        // Parallelize: fetch all shared data at once
        await Promise.all([
          fetchClubs(),
          fetchEvents(),
          fetchMembers()
        ]);
      } catch (err) {
        console.error("Lỗi tải shared data:", err);
      }
    };
    loadSharedData();
  }, []); // Run once on mount, not on every render

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

    // States cho Member
    showMemberModal, setShowMemberModal, editingMember, setEditingMember,
    memberForm, setMemberForm, viewingMember, setViewingMember,
    showViewMemberModal, setShowViewMemberModal, memberErrors, setMemberErrors,

    // States cho Event
    showEventModal, setShowEventModal, editingEvent, setEditingEvent,
    eventForm, setEventForm, viewingEvent, setViewingEvent,
    showViewEventModal, setShowViewEventModal,
    eventErrors, setEventErrors,

    // States cho Event Registrations
    showRegModal, setShowRegModal, editingReg, setEditingReg,
    regForm, setRegForm, viewingReg, setViewingReg,
    showViewRegModal, setShowViewRegModal, regErrors, setRegErrors,
    
    // States cho Campaigns
    showCampaignModal, setShowCampaignModal, editingCampaign, setEditingCampaign, 
    campaignForm, setCampaignForm, showViewCampaignModal, setShowViewCampaignModal, 
    viewingCampaign, setViewingCampaign, campaignErrors, setCampaignErrors,

    // States cho Interviews
    showInterviewModal, setShowInterviewModal, editingInterview, setEditingInterview, interviewForm, setInterviewForm, interviewErrors, setInterviewErrors,
    showStartModal, setShowStartModal, startForm, setStartForm, startErrors, setStartErrors,
    showFinishModal, setShowFinishModal, finishForm, setFinishForm, finishErrors, setFinishErrors,
    viewingInterview, setViewingInterview, showViewInterviewModal, setShowViewInterviewModal,
    
    clubErrors, setClubErrors,
    userErrors, setUserErrors
  } = useDashboardUI();

  // ============================================
  // --- LAZY LOADING: Tab-based data fetching ---
  // ============================================
  const activeFetchKey = (() => {
    switch (activeTab) {
      case "users":
        return `users|${userKeyword}|${userFilterRole}|${userFilterIsActive}|${userPage}`;
      case "clubs":
        return `clubs|${keyword}|${page}`;
      case "members":
        return `members|${memberFilterClub}|${memberFilterRole}|${memberPage}`;
      case "events":
        return `events|${eventKeyword}|${eventFilterClub}|${eventFilterIsPrivate}|${eventPage}`;
      case "event_registrations":
        return `event_registrations|${selectedEventId}|${regKeyword}|${regPage}`;
      case "campaigns":
        return `campaigns|${campKeyword}|${campFilterClub}|${campFilterIsActive}|${campPage}`;
      case "interviews":
        return `interviews|${intKeyword}|${intFilterClub}|${filterCampaign}|${intFilterStatus}|${intFilterResult}`;
      default:
        return String(activeTab || "");
    }
  })();

  useEffect(() => {
    // ✅ Skip if query state hasn't changed (prevents duplicate fetch in StrictMode)
    if (lastFetchKeyRef.current === activeFetchKey) return;
    lastFetchKeyRef.current = activeFetchKey;

    // Only load data for active tab
    switch (activeTab) {
      case "users":
        fetchUsers();
        break;
      case "clubs":
        fetchClubs();
        break;
      case "members":
        fetchMembers();
        break;
      case "events":
        fetchEvents();
        break;
      case "event_registrations":
        // fetchRegistrations handled by useEventRegistrations when selectedEventId/page/keyword changes
        break;
      case "campaigns":
        fetchCampaigns();
        break;
      case "interviews":
        fetchInterviews();
        break;
      default:
        break;
    }
  }, [activeFetchKey]);

  // =========================================================
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO USER ---
  // =========================================================
  const openAddUser = () => {
    setEditingUser(null);
    setUserForm({ fullName: "", email: "", password: "", role: "member", isActive: 1, clubId: "", uploadFiles: [], existingPhotos: [] });
    setUserErrors({});
    setShowUserModal(true);
  };

  const openEditUser = async (u) => {
    let existingPhotos = [];
    try {
      const photoResponse = await photoService.getByUser(u.userId);
      existingPhotos = photoService.normalizePhotos(photoResponse);
    } catch (err) {
      console.error("Lỗi tải ảnh user khi mở form sửa:", err);
    }

    setEditingUser(u.userId);
    setUserForm({ ...u, password: "", clubId: u.clubId || "", uploadFiles: [], existingPhotos });
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

    setUserErrors({});

    const token = localStorage.getItem("token");

    try {
      let currentUserId = editingUser;

      if (editingUser) {
        const updatePayload = {
          email: userForm.email.trim(),
          fullName: userForm.fullName.trim(),
          role: userForm.role,
          isActive: parseInt(userForm.isActive)
        };

        const result = await updateUser(editingUser, updatePayload);
        if (result && result.success) {
          // Sau khi cập nhật xong, upload ảnh nếu có
          if (userForm.uploadFiles && userForm.uploadFiles.length > 0) {
            for (let i = 0; i < userForm.uploadFiles.length; i++) {
              const item = userForm.uploadFiles[i];
              if (!item.title || !item.title.trim()) {
                alert(`Ảnh ${i + 1}: Vui lòng nhập tiêu đề`);
                return;
              }
              const formData = new FormData();
              formData.append("File", item.file);
              formData.append("Title", item.title.trim());
              formData.append("Type", parseInt(item.type)); // 1: Main, 2: Cover, 3: Side
              formData.append("UserId", editingUser);
              await photoService.upload(formData);
            }
          }
          alert("Cập nhật tài khoản " + (userForm.uploadFiles?.length > 0 ? "và upload ảnh " : "") + "thành công!");
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

        // Gọi API trực tiếp để lấy userId từ response
        const response = await fetch("https://localhost:7251/api/Users", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(createPayload)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Thêm mới tài khoản thất bại!");
        }

        const responseData = await response.json();
        // Bao trọn mọi loại format response từ C#
        console.log("📌 CREATE USER RESPONSE:", responseData); // Debug log
        
        // Thêm nhiều fallback options
        let extractedId = responseData?.value?.userId || 
                         responseData?.data?.userId || 
                         responseData?.userId || 
                         responseData?.id || 
                         responseData?.data?.id ||
                         (Array.isArray(responseData) && responseData[0]?.userId) ||
                         (Array.isArray(responseData) && responseData[0]?.id);
        
        currentUserId = extractedId;

        if (!currentUserId) {
          const errorMsg = `Không thể lấy userId từ server!\n\n📌 Server Response:\n${JSON.stringify(responseData, null, 2)}\n\n👉 Vui lòng kiểm tra Console để xem format response từ Backend!`;
          console.error("❌ Response format:", JSON.stringify(responseData, null, 2));
          throw new Error(errorMsg);
        }
        
        console.log("✅ Extracted userId:", currentUserId);

        // Sau khi tạo xong, upload ảnh nếu có
        if (userForm.uploadFiles && userForm.uploadFiles.length > 0) {
          for (let i = 0; i < userForm.uploadFiles.length; i++) {
            const item = userForm.uploadFiles[i];
            if (!item.title || !item.title.trim()) {
              alert(`Ảnh ${i + 1}: Vui lòng nhập tiêu đề`);
              return;
            }
            const formData = new FormData();
            formData.append("File", item.file);
            formData.append("Title", item.title.trim());
            formData.append("Type", parseInt(item.type)); // 1: Main, 2: Cover, 3: Side
            formData.append("UserId", currentUserId);
            await photoService.upload(formData);
          }
        }

        alert("Tạo tài khoản " + (userForm.uploadFiles?.length > 0 ? "và upload ảnh " : "") + "thành công!");
        setShowUserModal(false);
      }

      fetchUsers(); // Refresh danh sách users
    } catch (error) {
      setUserErrors({ general: error.message });
      alert("Lỗi: " + error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      const result = await deleteUser(id);
      if (result && result.success) {
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
    setClubForm({ clubName: "", title: "", description: "", leaderId: "", uploadFiles: [], existingPhotos: [] });
    setClubErrors({});
    // ✅ Use cached leaderUsers instead of fetching
    setShowClubModal(true);
  };

  const openEditClub = async (c) => {
    // 🚀 PARALLELIZE: Fetch photos + detail simultaneously
    const [photoResponse, detail] = await Promise.all([
      photoService.getByClub(c.clubId).catch((err) => {
        console.error("Lỗi tải ảnh CLB khi mở form sửa:", err);
        return null;
      }),
      clubService.getById(c.clubId).catch((err) => {
        console.error("Lỗi tải chi tiết CLB khi mở form sửa:", err);
        return null;
      })
    ]);

    const existingPhotos = photoResponse ? photoService.normalizePhotos(photoResponse) : [];

    let currentLeaderId =
      detail?.leaderId ??
      detail?.leaderUserId ??
      detail?.leader?.userId ??
      c.leaderId ??
      c.leaderUserId ??
      c.leader?.userId ??
      "";

    // Fallback: nếu backend list/detail chưa trả leaderId, map tạm bằng leaderName
    if ((currentLeaderId === "" || currentLeaderId === null || currentLeaderId === undefined) && c.leaderName) {
      const foundLeader = leaderUsers.find(
        (u) => normalizeName(u.fullName) === normalizeName(c.leaderName)
      );
      currentLeaderId = foundLeader?.userId ?? "";
    }

    setEditingClub(c.clubId);
    setClubForm({
      clubName: detail?.clubName ?? c.clubName,
      title: detail?.title ?? c.title ?? "",
      description: detail?.description ?? c.description,
      leaderId: currentLeaderId !== "" ? String(currentLeaderId) : "",
      uploadFiles: [],
      existingPhotos
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

    const token = localStorage.getItem("token");

    try {
      let currentClubId = editingClub;

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
        if (!editingClub) {
          // Nếu tạo mới, cần lấy ClubId từ response
          // Hiện tại không có ClubId từ result, nên bypass upload
          // TODO: Backend cần return ClubId khi tạo mới Club
          setShowClubModal(false);
        } else {
          // Nếu cập nhật, upload ảnh nếu có
          if (clubForm.uploadFiles && clubForm.uploadFiles.length > 0) {
            for (let i = 0; i < clubForm.uploadFiles.length; i++) {
              const item = clubForm.uploadFiles[i];
              if (!item.title || !item.title.trim()) {
                alert(`Ảnh ${i + 1}: Vui lòng nhập tiêu đề`);
                return;
              }
              const formData = new FormData();
              formData.append("File", item.file);
              formData.append("Title", item.title.trim());
              formData.append("Type", parseInt(item.type)); // 1: Main, 2: Cover, 3: Side
              formData.append("ClubId", editingClub);
              await photoService.upload(formData);
            }
          }
          alert("Cập nhật Câu lạc bộ " + (clubForm.uploadFiles?.length > 0 ? "và upload ảnh " : "") + "thành công!");
          setShowClubModal(false);
        }
      } else if (result.validationErrors) {
        setClubErrors(result.validationErrors);
      } else {
        alert(result?.message || "Lỗi thao tác!");
      }
    } catch (error) {
      setClubErrors({ general: error.message });
      alert("Lỗi: " + error.message);
    }
  };

  const handleDeleteClub = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Câu lạc bộ này?")) {
      const result = await deleteClub(id);
      if (result && result.success) {
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
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO MEMBERS ---
  // =========================================================
  const openAddMember = () => {
    setEditingMember(null);
    const nowLocal = new Date().toISOString().slice(0, 16);
    setMemberForm({ clubId: "", userId: "", memberRole: "member", joinAt: nowLocal, uploadFiles: [], existingPhotos: [] });
    setMemberErrors({});
    setShowMemberModal(true);
  };

  const openEditMember = async (m) => {
    let existingPhotos = [];
    try {
      const photoResponse = await photoService.getByClubMember(m.clubMemberId);
      existingPhotos = photoService.normalizePhotos(photoResponse);
    } catch (err) {
      console.error("Lỗi tải ảnh thành viên khi mở form sửa:", err);
    }

    setEditingMember(m.clubMemberId);
    const formattedDate = m.joinAt ? m.joinAt.slice(0, 16) : "";

    setMemberForm({
      clubId: m.clubId ? m.clubId.toString() : "",
      userId: m.userId ? m.userId.toString() : "",
      memberRole: m.memberRole || "member",
      joinAt: formattedDate,
      uploadFiles: [],
      existingPhotos
    });

    setMemberErrors({});
    setShowMemberModal(true);
  };

  const handleSaveMember = async () => {
    let errors = {};
    if (!memberForm.clubId) errors.clubId = "Vui lòng chọn Câu lạc bộ";
    if (!memberForm.userId) errors.userId = "Vui lòng chọn User";
    if (!memberForm.memberRole) errors.memberRole = "Vui lòng chọn vai trò";

    if (Object.keys(errors).length > 0) {
      setMemberErrors(errors);
      return;
    }
    setMemberErrors({});

    const token = localStorage.getItem("token");

    try {
      let currentMemberId = editingMember;

      const payload = {
        clubId: parseInt(memberForm.clubId),
        userId: parseInt(memberForm.userId),
        memberRole: memberForm.memberRole,
        joinAt: memberForm.joinAt ? new Date(memberForm.joinAt).toISOString() : null
      };

      const result = editingMember
        ? await updateMember(editingMember, payload)
        : await createMember(payload);

      if (result && result.success) {
        // Upload ảnh nếu có
        if (memberForm.uploadFiles && memberForm.uploadFiles.length > 0) {
          for (let i = 0; i < memberForm.uploadFiles.length; i++) {
            const item = memberForm.uploadFiles[i];
            if (!item.title || !item.title.trim()) {
              alert(`Ảnh ${i + 1}: Vui lòng nhập tiêu đề`);
              return;
            }
            const formData = new FormData();
            formData.append("File", item.file);
            formData.append("Title", item.title.trim());
            formData.append("Type", parseInt(item.type)); // 1: Main, 2: Cover, 3: Side
            formData.append("ClubMemberId", editingMember || currentMemberId);
            await photoService.upload(formData);
          }
        }
        alert("Lưu thành viên " + (memberForm.uploadFiles?.length > 0 ? "và upload ảnh " : "") + "thành công!");
        setShowMemberModal(false);
      } else if (result.validationErrors) {
        setMemberErrors(result.validationErrors);
      } else {
        alert(result?.message || "Lỗi thao tác!");
      }
    } catch (error) {
      setMemberErrors({ general: error.message });
      alert("Lỗi: " + error.message);
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) {
      const result = await deleteMember(id);
      if (result && result.validationErrors) {
        alert("Lỗi:\n" + Object.values(result.validationErrors).join("\n"));
      } else if (!result.success) {
        alert(result?.message || "Xóa thất bại!");
      }
    }
  };

  const openViewMember = (m) => { setViewingMember(m); setShowViewMemberModal(true); };

  // =========================================================
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO EVENTS ---
  // =========================================================
  const openAddEvent = () => {
    setEditingEvent(null);
    const nowLocal = new Date().toISOString().slice(0, 16);
    setEventForm({ clubId: "", title: "", description: "", eventDate: nowLocal, isPrivate: true, priority: 1, uploadFiles: [], existingPhotos: [] });
    setEventErrors({});
    setShowEventModal(true);
  };

  const openEditEvent = async (ev) => {
    let existingPhotos = [];
    try {
      const photoResponse = await photoService.getByEvent(ev.id);
      existingPhotos = photoService.normalizePhotos(photoResponse);
    } catch (err) {
      console.error("Lỗi tải ảnh sự kiện khi mở form sửa:", err);
    }

    setEditingEvent(ev.id);
    const formattedDate = ev.eventDate ? ev.eventDate.slice(0, 16) : "";
    setEventForm({
      clubId: ev.clubId ? ev.clubId.toString() : "",
      title: ev.title || "",
      description: ev.description || "",
      eventDate: formattedDate,
      isPrivate: ev.isPrivate,
      priority: ev.priority || 1,
      uploadFiles: [],
      existingPhotos
    });
    setEventErrors({});
    setShowEventModal(true);
  };

  const handleSaveEvent = async () => {
    let errors = {};
    if (!eventForm.clubId) errors.clubId = "Vui lòng chọn Câu lạc bộ";
    if (!eventForm.title || !eventForm.title.trim()) errors.title = "Vui lòng nhập tên Sự kiện";
    if (!eventForm.eventDate) errors.eventDate = "Vui lòng chọn thời gian";

    if (Object.keys(errors).length > 0) {
      setEventErrors(errors);
      return;
    }
    setEventErrors({});

    const token = localStorage.getItem("token");

    try {
      let currentEventId = editingEvent;

      const payload = {
        clubId: parseInt(eventForm.clubId),
        title: eventForm.title.trim(),
        description: eventForm.description,
        isPrivate: eventForm.isPrivate,
        priority: eventForm.priority,
        eventDate: eventForm.eventDate ? new Date(eventForm.eventDate).toISOString() : null
      };

      const result = editingEvent ? await updateEvent(editingEvent, payload) : await createEvent(payload);

      if (result && result.success) {
        // Upload ảnh nếu có
        if (eventForm.uploadFiles && eventForm.uploadFiles.length > 0) {
          for (let i = 0; i < eventForm.uploadFiles.length; i++) {
            const item = eventForm.uploadFiles[i];
            if (!item.title || !item.title.trim()) {
              alert(`Ảnh ${i + 1}: Vui lòng nhập tiêu đề`);
              return;
            }
            const formData = new FormData();
            formData.append("File", item.file);
            formData.append("Title", item.title.trim());
            formData.append("Type", parseInt(item.type)); // 1: Main, 2: Cover, 3: Side
            formData.append("EventId", editingEvent || currentEventId);
            await photoService.upload(formData);
          }
        }
        alert("Lưu sự kiện " + (eventForm.uploadFiles?.length > 0 ? "và upload ảnh " : "") + "thành công!");
        setShowEventModal(false);
      } else if (result.validationErrors) {
        setEventErrors(result.validationErrors);
      } else {
        alert(result?.message || "Lỗi thao tác!");
      }
    } catch (error) {
      setEventErrors({ general: error.message });
      alert("Lỗi: " + error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Sự kiện này?")) {
      const result = await deleteEvent(id);
      if (result && result.validationErrors) alert("Lỗi:\n" + Object.values(result.validationErrors).join("\n"));
      else if (!result.success) alert(result?.message || "Xóa thất bại!");
    }
  };

  const openViewEvent = (ev) => { setViewingEvent(ev); setShowViewEventModal(true); };

  // =========================================================
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO EVENT REGISTRATIONS ---
  // =========================================================
  const openAddReg = () => {
    setEditingReg(null);
    setRegForm({ eventId: selectedEventId, isGuest: false, userId: "", guestName: "", guestEmail: "", checkedIn: false, checkName: "", isCare: 0 });
    setRegErrors({});
    setShowRegModal(true);
  };

  const openEditReg = (r) => {
    setEditingReg(r.id);
    const isGuest = !r.userId || r.userId === 0;
    setRegForm({
      eventId: r.eventId ? r.eventId.toString() : selectedEventId,
      isGuest: isGuest,
      userId: r.userId ? r.userId.toString() : "",
      guestName: r.guestName || "",
      guestEmail: r.guestEmail || "",
      checkedIn: r.checkedIn || false,
      checkName: r.checkName || "",
      isCare: r.isCare || 0
    });
    setRegErrors({});
    setShowRegModal(true);
  };

  const handleSaveReg = async () => {
    let errors = {};
    if (!regForm.eventId) errors.eventId = "Lỗi: Chưa xác định được Sự kiện.";

    if (regForm.isGuest) {
      if (!regForm.guestName?.trim()) errors.guestName = "Vui lòng nhập tên Khách";
      if (!regForm.guestEmail?.trim()) errors.guestEmail = "Vui lòng nhập Email Khách";
    } else {
      if (!regForm.userId) errors.userId = "Vui lòng chọn Tài khoản User";
    }

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors); return;
    }
    setRegErrors({});

    const payload = {
      eventId: parseInt(regForm.eventId),
      userId: regForm.isGuest ? 0 : parseInt(regForm.userId),
      guestName: regForm.isGuest ? regForm.guestName.trim() : null,
      guestEmail: regForm.isGuest ? regForm.guestEmail.trim() : null,
      checkedIn: regForm.checkedIn,
      checkName: regForm.checkedIn ? regForm.checkName?.trim() : null,
      isCare: regForm.isCare
    };

    const result = editingReg ? await updateRegistration(editingReg, payload) : await createRegistration(payload);

    if (result && result.success) setShowRegModal(false);
    else if (result.validationErrors) setRegErrors(result.validationErrors);
    else alert(result?.message || "Lỗi thao tác!");
  };

  const handleDeleteReg = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đăng ký này?")) {
      const result = await deleteRegistration(id);
      if (!result.success) alert(result?.message || "Xóa thất bại!");
    }
  };
  const openViewReg = (r) => { setViewingReg(r); setShowViewRegModal(true); };

  // =========================================================
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO CAMPAIGNS ---
  // =========================================================
  const openAddCampaign = () => {
    setEditingCampaign(null);
    setCampaignForm({ clubId: "", title: "", startDate: "", endDate: "", isActive: true, uploadFiles: [], existingPhotos: [] });
    setCampaignErrors({});
    setShowCampaignModal(true);
  };

  const openEditCampaign = async (camp) => {
    let existingPhotos = [];
    try {
      const photoResponse = await photoService.getByCampaign(camp.campaignId);
      existingPhotos = photoService.normalizePhotos(photoResponse);
    } catch (err) {
      console.error("Lỗi tải ảnh đợt tuyển khi mở form sửa:", err);
    }

    setEditingCampaign(camp.campaignId);
    setCampaignForm({
      clubId: camp.clubId,
      title: camp.title,
      startDate: camp.startDate ? camp.startDate.split('T')[0] : "",
      endDate: camp.endDate ? camp.endDate.split('T')[0] : "",
      isActive: camp.isActive,
      uploadFiles: [],
      existingPhotos
    });
    setCampaignErrors({});
    setShowCampaignModal(true);
  };

  const handleSaveCampaign = async () => {
    let errors = {};
    if (!campaignForm.clubId) errors.clubId = "Vui lòng chọn Câu lạc bộ";
    if (!campaignForm.title?.trim()) errors.title = "Vui lòng nhập Tên đợt tuyển";

    if (Object.keys(errors).length > 0) { setCampaignErrors(errors); return; }
    setCampaignErrors({});

    const payload = {
      clubId: parseInt(campaignForm.clubId),
      title: campaignForm.title.trim(),
      startDate: campaignForm.startDate ? new Date(campaignForm.startDate).toISOString() : null,
      endDate: campaignForm.endDate ? new Date(campaignForm.endDate).toISOString() : null,
      isActive: campaignForm.isActive === true || campaignForm.isActive === "true"
    };

    const result = editingCampaign ? await updateCampaign(editingCampaign, payload) : await createCampaign(payload);

    if (result.success) {
      // Upload ảnh cho campaign nếu có
      const uploadedFiles = campaignForm.uploadFiles || [];
      if (uploadedFiles.length > 0) {
        const createdCampaignId =
          editingCampaign ||
          result?.data?.campaignId ||
          result?.data?.data?.campaignId ||
          result?.data?.id ||
          null;

        if (!createdCampaignId) {
          alert("Đợt tuyển đã lưu nhưng chưa xác định được campaignId để upload ảnh.");
        } else {
          for (let i = 0; i < uploadedFiles.length; i++) {
            const item = uploadedFiles[i];
            if (!item.title || !item.title.trim()) {
              alert(`Ảnh ${i + 1}: Vui lòng nhập tiêu đề`);
              return;
            }
            const formData = new FormData();
            formData.append("File", item.file);
            formData.append("Title", item.title.trim());
            formData.append("Type", parseInt(item.type, 10));
            formData.append("CampaignsId", createdCampaignId);
            await photoService.upload(formData);
          }
        }
      }

      setShowCampaignModal(false);
    } else if (result.validationErrors) {
      setCampaignErrors(result.validationErrors);
    } else {
      alert(result.message);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (window.confirm("Xóa đợt tuyển này?")) {
      const res = await deleteCampaign(id);
      if (!res.success) alert(res.message);
    }
  };

  const openViewCampaign = (camp) => { setViewingCampaign(camp); setShowViewCampaignModal(true); };

  // =========================================================
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO INTERVIEWS ---
  // =========================================================
  const openAddWalkIn = () => {
    setEditingInterview(null);
    setInterviewForm({ clubId: "", campaignId: "", applicantName: "", applicantEmail: "", applicantPhone: "", interviewDate: "", cvUrl: "", note: "" });
    setInterviewErrors({});
    setShowInterviewModal(true);
  };

  const openEditInterview = (item) => {
    setEditingInterview(item.interviewId);
    setInterviewForm({
      clubId: item.clubId ? item.clubId.toString() : "",
      campaignId: item.campaignId ? item.campaignId.toString() : "",
      applicantName: item.applicantName || "",
      applicantEmail: item.applicantEmail || "",
      applicantPhone: item.applicantPhone || "",
      interviewDate: item.interviewDate ? item.interviewDate.slice(0, 16) : "",
      cvUrl: item.cvUrl || "",
      note: item.note || ""
    });
    setInterviewErrors({});
    setShowInterviewModal(true);
  };

  const handleSaveInterview = async () => {
    let errors = {};
    if (!editingInterview && !interviewForm.clubId) errors.clubId = "Chọn Câu lạc bộ";
    if (!interviewForm.applicantName?.trim()) errors.applicantName = "Nhập tên ứng viên";
    
    if (Object.keys(errors).length > 0) { setInterviewErrors(errors); return; }
    setInterviewErrors({});

    const payload = {
      applicantName: interviewForm.applicantName.trim(),
      applicantEmail: interviewForm.applicantEmail || null,
      applicantPhone: interviewForm.applicantPhone || null,
      interviewDate: interviewForm.interviewDate ? new Date(interviewForm.interviewDate).toISOString() : null,
      cvUrl: interviewForm.cvUrl || null,
      note: interviewForm.note || null
    };

    let result;
    if (editingInterview) {
      result = await updateInterview(editingInterview, payload);
    } else {
      payload.clubId = parseInt(interviewForm.clubId);
      if (interviewForm.campaignId) payload.campaignId = parseInt(interviewForm.campaignId);
      result = await createWalkIn(payload);
    }

    if (result.success) setShowInterviewModal(false);
    else if (result.validationErrors) setInterviewErrors(result.validationErrors);
    else alert(result.message);
  };

  const handleDeleteInterview = async (id) => {
    if (window.confirm("Xóa hồ sơ phỏng vấn này?")) {
      const res = await deleteInterview(id);
      if (!res.success) alert(res.message || "Xóa thất bại");
    }
  };

  const handleCheckIn = async (id) => {
    if(window.confirm("Xác nhận ứng viên đã đến check-in?")) await checkIn(id);
  };
  
  const handleNoShow = async (id) => {
    if(window.confirm("Đánh dấu ứng viên KHÔNG ĐẾN?")) await noShow(id);
  };

  const handleCancel = async (id) => {
    if(window.confirm("Bạn muốn HỦY lịch phỏng vấn này?")) await cancelInterview(id);
  };

  const openStart = (item) => {
    setStartForm({ interviewId: item.interviewId, evaluatorId: "", evaluatorName: "" });
    setStartErrors({});
    setShowStartModal(true);
  };

  const handleStartInterview = async () => {
    if(!startForm.evaluatorId) { setStartErrors({ evaluatorId: "Vui lòng chọn Giám khảo" }); return; }
    const res = await startInterview(startForm.interviewId, { evaluatorId: startForm.evaluatorId, evaluatorName: startForm.evaluatorName });
    if(res.success) setShowStartModal(false); else alert(res.message);
  };

  // Mở Đánh giá Lần đầu (Từ Kanban)
  const openFinish = (item) => {
    setIsUpdatingResult(false);
    setFinishForm({ 
      interviewId: item.interviewId, 
      result: item.result || 0,
      evaluation: item.evaluation || "", 
      note: item.note || "",
      applicantName: item.applicantName,
      applicantEmail: item.applicantEmail,
      applicantPhone: item.applicantPhone,
      cvUrl: item.cvUrl
    });
    setShowFinishModal(true);
  };

  // Mở Cập nhật Lại Đánh giá (Từ Bảng Lịch sử)
  const openUpdateResult = (item) => {
    setIsUpdatingResult(true);
    setFinishForm({ 
      interviewId: item.interviewId, 
      result: item.result || 0,
      evaluation: item.evaluation || "", 
      note: item.note || "",
      applicantName: item.applicantName,
      applicantEmail: item.applicantEmail,
      applicantPhone: item.applicantPhone,
      cvUrl: item.cvUrl
    });
    setShowFinishModal(true);
  };

  // Gộp chung hàm Submit
  const handleFinishOrUpdateInterview = async () => {
    const payload = { 
      result: finishForm.result, 
      evaluation: finishForm.evaluation || null, 
      note: finishForm.note || null 
    };
    
    let res;
    if (isUpdatingResult) {
      res = await updateResultAfterInterview(finishForm.interviewId, payload);
    } else {
      res = await finishInterview(finishForm.interviewId, payload);
    }
    
    if(res.success) setShowFinishModal(false); else alert(res.message);
  };

  const handleSendEmail = async () => {
    if (!intFilterClub || intFilterClub === "all") { alert("Vui lòng BỘ LỌC Câu lạc bộ trước khi gửi Email chung!"); return; }
    const type = window.prompt("Nhập 1 để gửi email Pass, 2 để gửi email Fail:");
    if(type === "1" || type === "2") {
      const res = await sendEmails(parseInt(intFilterClub), parseInt(type));
      alert(res.success ? "Đã gửi Email thành công" : res.message);
    }
  };

  const openViewInterview = async (item) => {
    const res = await getInterviewById(item.interviewId);
    if (res.success) {
      setViewingInterview(res.data);
      setShowViewInterviewModal(true);
    } else {
      alert("Lỗi khi tải chi tiết: " + res.message);
    }
  };

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

          {/* Ẩn StatsSection khi ở tab interviews hoặc campaigns */}
          {activeTab !== "interviews" && activeTab !== "campaigns" && (
            <StatsSection usersCount={userPaginationMeta.TotalCount || 0} clubsCount={paginationMeta.TotalCount || 0} />
          )}

          {/* TAB USERS */}
          {activeTab === "users" && (
            <UsersTable
              users={users}
              keyword={userKeyword}
              onSearch={(value) => {
                setUserPage(1);
                setUserKeyword(value);
              }}
              page={userPage}
              totalPages={userPaginationMeta.TotalPages}
              onPageChange={setUserPage}
              filterRole={userFilterRole}
              onFilterChange={(value) => {
                setUserPage(1);
                setUserFilterRole(value);
              }}
              filterIsActive={userFilterIsActive}
              onFilterActiveChange={(value) => {
                setUserPage(1);
                setUserFilterIsActive(value);
              }}
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
              onSearch={(value) => {
                setPage(1);
                setKeyword(value);
              }}
              page={page}
              totalPages={paginationMeta.TotalPages}
              onPageChange={setPage}
              onAdd={openAddClub}
              onEdit={openEditClub}
              onDelete={handleDeleteClub}
              onView={openViewClub}
            />
          )}

          {/* TAB MEMBERS */}
          {activeTab === "members" && (
            <MembersTable
              members={members}
              clubs={clubs}
              users={users}
              page={memberPage}
              totalPages={memberPaginationMeta.TotalPages}
              onPageChange={setMemberPage}
              filterClub={memberFilterClub}
              onFilterClubChange={(value) => {
                setMemberPage(1);
                setMemberFilterClub(value);
              }}
              filterRole={memberFilterRole}
              onFilterRoleChange={(value) => {
                setMemberPage(1);
                setMemberFilterRole(value);
              }}
              onAdd={openAddMember}
              onEdit={openEditMember}
              onDelete={handleDeleteMember}
              onView={openViewMember}
            />
          )}
          
          {/* TAB EVENTS */}
          {activeTab === "events" && (
            <EventsTable
              events={events}
              clubs={clubs}
              keyword={eventKeyword}
              onSearch={(value) => {
                setEventPage(1);
                setEventKeyword(value);
              }}
              page={eventPage}
              totalPages={eventPaginationMeta.TotalPages}
              onPageChange={setEventPage}
              filterClub={eventFilterClub}
              onFilterClubChange={(value) => {
                setEventPage(1);
                setEventFilterClub(value);
              }}
              filterIsPrivate={eventFilterIsPrivate}
              onFilterIsPrivateChange={(value) => {
                setEventPage(1);
                setEventFilterIsPrivate(value);
              }}
              onAdd={openAddEvent}
              onEdit={openEditEvent}
              onDelete={handleDeleteEvent}
              onView={openViewEvent}
            />
          )}

          {/* TAB EVENT REGISTRATIONS */}
          {activeTab === "event_registrations" && (
            <EventRegistrationsTable
              registrations={registrations}
              events={events}
              users={users}
              selectedEventId={selectedEventId}
              onEventChange={(value) => {
                setRegPage(1);
                setSelectedEventId(value);
              }}
              keyword={regKeyword}
              onSearch={(value) => {
                setRegPage(1);
                setRegKeyword(value);
              }}
              page={regPage}
              totalPages={regPaginationMeta.TotalPages}
              onPageChange={setRegPage}
              onAdd={openAddReg}
              onEdit={openEditReg}
              onDelete={handleDeleteReg}
              onView={openViewReg}
            />
          )}

          {/* TAB CAMPAIGNS */}
          {activeTab === "campaigns" && (
            <CampaignsTable
              campaigns={campaigns} clubs={clubs}
              keyword={campKeyword} onSearch={(value) => {
                setCampPage(1);
                setCampKeyword(value);
              }}
              filterClub={campFilterClub} onFilterClubChange={(value) => {
                setCampPage(1);
                setCampFilterClub(value);
              }}
              filterIsActive={campFilterIsActive} onFilterIsActiveChange={(value) => {
                setCampPage(1);
                setCampFilterIsActive(value);
              }}
              page={campPage} totalPages={campPaginationMeta.TotalPages} onPageChange={setCampPage}
              onAdd={openAddCampaign} onEdit={openEditCampaign} onDelete={handleDeleteCampaign} onView={openViewCampaign}
            />
          )}

          {/* TAB INTERVIEWS BOARD */}
          {activeTab === "interviews" && (
            <InterviewBoard
              interviews={interviews} clubs={clubs} campaigns={campaigns} // TRUYỀN CAMPAIGNS
              filterClub={intFilterClub} onFilterClubChange={(value) => {
                setIntFilterClub(value);
              }}
              filterStatus={intFilterStatus} onFilterStatusChange={(value) => {
                setIntFilterStatus(value);
              }}
              filterResult={intFilterResult} onFilterResultChange={(value) => {
                setIntFilterResult(value);
              }}
              filterCampaign={filterCampaign} 
              onFilterCampaignChange={(value) => {
                setFilterCampaign(value);
              }}
              keyword={intKeyword} onSearch={(value) => {
                setIntKeyword(value);
              }}
              onAddWalkIn={openAddWalkIn} onCheckIn={handleCheckIn} onOpenStart={openStart} 
              onOpenFinish={openFinish} onOpenUpdateResult={openUpdateResult}
              onNoShow={handleNoShow} onCancel={handleCancel} onSendEmail={handleSendEmail} onView={openViewInterview}
            />
          )}
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
        showMemberModal={showMemberModal} setShowMemberModal={setShowMemberModal}
        memberForm={memberForm} setMemberForm={setMemberForm}
        editingMember={editingMember} handleSaveMember={handleSaveMember}
        showViewMemberModal={showViewMemberModal} setShowViewMemberModal={setShowViewMemberModal}
        viewingMember={viewingMember}
        memberErrors={memberErrors} setMemberErrors={setMemberErrors}
        showEventModal={showEventModal} setShowEventModal={setShowEventModal}
        eventForm={eventForm} setEventForm={setEventForm}
        editingEvent={editingEvent} handleSaveEvent={handleSaveEvent}
        showViewEventModal={showViewEventModal} setShowViewEventModal={setShowViewEventModal}
        viewingEvent={viewingEvent}
        eventErrors={eventErrors} setEventErrors={setEventErrors}
        showRegModal={showRegModal} setShowRegModal={setShowRegModal}
        regForm={regForm} setRegForm={setRegForm}
        editingReg={editingReg} handleSaveReg={handleSaveReg}
        showViewRegModal={showViewRegModal} setShowViewRegModal={setShowViewRegModal}
        viewingReg={viewingReg}
        regErrors={regErrors} setRegErrors={setRegErrors}
        events={events}

        // 👉 TRUYỀN THÊM PROPS CAMPAIGN CHO MODAL
        showCampaignModal={showCampaignModal} setShowCampaignModal={setShowCampaignModal}
        editingCampaign={editingCampaign} setEditingCampaign={setEditingCampaign}
        campaignForm={campaignForm} setCampaignForm={setCampaignForm}
        handleSaveCampaign={handleSaveCampaign}
        showViewCampaignModal={showViewCampaignModal} setShowViewCampaignModal={setShowViewCampaignModal}
        viewingCampaign={viewingCampaign} campaignErrors={campaignErrors} setCampaignErrors={setCampaignErrors}
        campaigns={campaigns}

        showInterviewModal={showInterviewModal} setShowInterviewModal={setShowInterviewModal}
        interviewForm={interviewForm} setInterviewForm={setInterviewForm}
        editingInterview={editingInterview} handleSaveInterview={handleSaveInterview}
        interviewErrors={interviewErrors} setInterviewErrors={setInterviewErrors}
        showStartModal={showStartModal} setShowStartModal={setShowStartModal}
        startForm={startForm} setStartForm={setStartForm}
        handleStartInterview={handleStartInterview}
        startErrors={startErrors} setStartErrors={setStartErrors}
        showFinishModal={showFinishModal} setShowFinishModal={setShowFinishModal}
        finishForm={finishForm} setFinishForm={setFinishForm}
        
        isUpdatingResult={isUpdatingResult}
        handleFinishInterview={handleFinishOrUpdateInterview}
        
        finishErrors={finishErrors} setFinishErrors={setFinishErrors}
        showViewInterviewModal={showViewInterviewModal} setShowViewInterviewModal={setShowViewInterviewModal}
        viewingInterview={viewingInterview}
        users={users}
        leaderUsers={leaderUsers}
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