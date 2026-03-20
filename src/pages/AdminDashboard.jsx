// src/pages/AdminDashboard.jsx
import React from "react";
import { ThemeProvider } from "../context/ThemeContext";
import { useMembers } from "../hooks/useMembers";
import MembersTable from "../components/tables/MembersTable";
// Import Hooks chuẩn
import { useUsers } from "../hooks/useUsers";
import { useClubs } from "../hooks/useClubs";
import { useDashboardUI } from "../hooks/useDashboardUI";
import { useEvents } from "../hooks/useEvents";
import EventsTable from "../components/tables/EventsTable";
import { useEventRegistrations } from "../hooks/useEventRegistrations";
import EventRegistrationsTable from "../components/tables/EventRegistrationsTable";
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
    registrations, createRegistration, updateRegistration, deleteRegistration,
    selectedEventId, setSelectedEventId,
    keyword: regKeyword, setKeyword: setRegKeyword,
    page: regPage, setPage: setRegPage,
    paginationMeta: regPaginationMeta
  } = useEventRegistrations();

  const {
    clubs, createClub, updateClub, deleteClub,
    keyword, setKeyword, page, setPage, paginationMeta
  } = useClubs();

  const {
    members, createMember, updateMember, deleteMember,
    filterClub: memberFilterClub, setFilterClub: setMemberFilterClub,
    filterRole: memberFilterRole, setFilterRole: setMemberFilterRole,
    page: memberPage, setPage: setMemberPage,
    paginationMeta: memberPaginationMeta
  } = useMembers();

  const {
    events, createEvent, updateEvent, deleteEvent,
    keyword: eventKeyword, setKeyword: setEventKeyword,
    filterClub: eventFilterClub, setFilterClub: setEventFilterClub,
    filterIsPrivate: eventFilterIsPrivate, setFilterIsPrivate: setEventFilterIsPrivate,
    page: eventPage, setPage: setEventPage,
    paginationMeta: eventPaginationMeta
  } = useEvents();

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

    showMemberModal, setShowMemberModal, editingMember, setEditingMember,
    memberForm, setMemberForm, viewingMember, setViewingMember,
    showViewMemberModal, setShowViewMemberModal, memberErrors, setMemberErrors,

    showEventModal, setShowEventModal, editingEvent, setEditingEvent,
    eventForm, setEventForm, viewingEvent, setViewingEvent,
    showViewEventModal, setShowViewEventModal,
    eventErrors, setEventErrors,

    showRegModal, setShowRegModal, editingReg, setEditingReg,
    regForm, setRegForm, viewingReg, setViewingReg,
    showViewRegModal, setShowViewRegModal, regErrors, setRegErrors,
    
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
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO MEMBERS ---
  // =========================================================
  const openAddMember = () => {
    setEditingMember(null);
    const nowLocal = new Date().toISOString().slice(0, 16);
    setMemberForm({ clubId: "", userId: "", memberRole: "member", joinAt: nowLocal });
    setMemberErrors({});
    setShowMemberModal(true);
  };

  const openEditMember = (m) => {
    setEditingMember(m.clubMemberId);
    const formattedDate = m.joinAt ? m.joinAt.slice(0, 16) : "";

    setMemberForm({
      // Ép kiểu sang chuỗi để thẻ Select so khớp chính xác
      clubId: m.clubId ? m.clubId.toString() : "",
      userId: m.userId ? m.userId.toString() : "",
      memberRole: m.memberRole || "member",
      joinAt: formattedDate
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
      setShowMemberModal(false);
    } else if (result.validationErrors) {
      setMemberErrors(result.validationErrors);
    } else {
      alert(result?.message || "Lỗi thao tác!");
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

  // =========================================================
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO EVENTS ---
  // =========================================================
  const openAddEvent = () => {
    setEditingEvent(null);
    const nowLocal = new Date().toISOString().slice(0, 16);
    setEventForm({ clubId: "", title: "", description: "", eventDate: nowLocal, isPrivate: true, priority: 1 });
    setEventErrors({});
    setShowEventModal(true);
  };

  const openEditEvent = (ev) => {
    setEditingEvent(ev.id);
    const formattedDate = ev.eventDate ? ev.eventDate.slice(0, 16) : "";
    setEventForm({
      clubId: ev.clubId ? ev.clubId.toString() : "",
      title: ev.title || "",
      description: ev.description || "",
      eventDate: formattedDate,
      isPrivate: ev.isPrivate,
      priority: ev.priority || 1
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

    const payload = {
      clubId: parseInt(eventForm.clubId),
      title: eventForm.title.trim(),
      description: eventForm.description,
      isPrivate: eventForm.isPrivate,
      priority: eventForm.priority,
      eventDate: eventForm.eventDate ? new Date(eventForm.eventDate).toISOString() : null
    };

    const result = editingEvent ? await updateEvent(editingEvent, payload) : await createEvent(payload);

    if (result && result.success) setShowEventModal(false);
    else if (result.validationErrors) setEventErrors(result.validationErrors);
    else alert(result?.message || "Lỗi thao tác!");
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Sự kiện này?")) {
      const result = await deleteEvent(id);
      if (result && result.validationErrors) alert("Lỗi:\n" + Object.values(result.validationErrors).join("\n"));
      else if (!result.success) alert(result?.message || "Xóa thất bại!");
    }
  };

  const openViewEvent = (ev) => { setViewingEvent(ev); setShowViewEventModal(true); };
  const openViewMember = (m) => { setViewingMember(m); setShowViewMemberModal(true); };
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
              onFilterClubChange={setMemberFilterClub}
              filterRole={memberFilterRole}
              onFilterRoleChange={setMemberFilterRole}

              onAdd={openAddMember}
              onEdit={openEditMember}
              onDelete={handleDeleteMember}
              onView={openViewMember}
            />
          )}
          {activeTab === "interviews" && <div><h1>Đang chờ code Hook Phỏng vấn...</h1></div>}

          {/* TAB EVENTS */}
          {activeTab === "events" && (
            <EventsTable
              events={events}
              clubs={clubs}

              keyword={eventKeyword}
              onSearch={setEventKeyword}
              page={eventPage}
              totalPages={eventPaginationMeta.TotalPages}
              onPageChange={setEventPage}

              filterClub={eventFilterClub}
              onFilterClubChange={setEventFilterClub}
              filterIsPrivate={eventFilterIsPrivate}
              onFilterIsPrivateChange={setEventFilterIsPrivate}

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
              events={events} // Truyền events vào đây để làm list dropdown
              users={users}

              selectedEventId={selectedEventId}
              onEventChange={setSelectedEventId}

              keyword={regKeyword}
              onSearch={setRegKeyword}
              page={regPage}
              totalPages={regPaginationMeta.TotalPages}
              onPageChange={setRegPage}
              
              onAdd={openAddReg}
              onEdit={openEditReg}
              onDelete={handleDeleteReg}
              onView={openViewReg}
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