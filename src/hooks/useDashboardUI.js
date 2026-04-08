import { useState } from "react";

export const useDashboardUI = () => {
  const [activeTab, setActiveTab] = useState("users");

  // User
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userErrors, setUserErrors] = useState({});
  const [userForm, setUserForm] = useState({ fullName: "", email: "", password: "", role: "member", isActive: 1, uploadFiles: [] });
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [userFilterRole, setUserFilterRole] = useState("all");

  // Club
  const [showClubModal, setShowClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [clubForm, setClubForm] = useState({ clubName: "", title: "", description: "", leaderId: "", uploadFiles: [] });
  const [showViewClubModal, setShowViewClubModal] = useState(false);
  const [viewingClub, setViewingClub] = useState(null);
  const [clubErrors, setClubErrors] = useState({});

  // Member
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({ clubId: "", userId: "", memberRole: "member", joinAt: "", uploadFiles: [] });
  const [viewingMember, setViewingMember] = useState(null);
  const [showViewMemberModal, setShowViewMemberModal] = useState(false);
  const [memberErrors, setMemberErrors] = useState({});

  // Event
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ clubId: "", title: "", description: "", eventDate: "", isPrivate: true, priority: 0, uploadFiles: [] });
  const [viewingEvent, setViewingEvent] = useState(null);
  const [showViewEventModal, setShowViewEventModal] = useState(false);
  const [eventErrors, setEventErrors] = useState({});

  // Event Registration
  const [showRegModal, setShowRegModal] = useState(false);
  const [editingReg, setEditingReg] = useState(null);
  const [regForm, setRegForm] = useState({ eventId: "", isGuest: false, userId: "", guestName: "", guestEmail: "", checkedIn: false, checkName: "", isCare: 0 });
  const [viewingReg, setViewingReg] = useState(null);
  const [showViewRegModal, setShowViewRegModal] = useState(false);
  const [regErrors, setRegErrors] = useState({});

  // 👉 CAMPAIGN (ĐỢT TUYỂN) - THÊM VÀO ĐÂY
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignForm, setCampaignForm] = useState({ clubId: "", title: "", startDate: "", endDate: "", isActive: true, uploadFiles: [], existingPhotos: [] });
  const [showViewCampaignModal, setShowViewCampaignModal] = useState(false);
  const [viewingCampaign, setViewingCampaign] = useState(null);
  const [campaignErrors, setCampaignErrors] = useState({});

  // Interviews
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ clubId: "", campaignId: "", applicantName: "", applicantEmail: "", applicantPhone: "", interviewDate: "", cvUrl: "", note: "" });
  const [interviewErrors, setInterviewErrors] = useState({});

  const [showStartModal, setShowStartModal] = useState(false);
  const [startForm, setStartForm] = useState({ interviewId: null, evaluatorId: "", evaluatorName: "" });
  const [startErrors, setStartErrors] = useState({});

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishForm, setFinishForm] = useState({ interviewId: null, result: 0, evaluation: "", note: "", applicantName: "", applicantEmail: "", applicantPhone: "", cvUrl: "" });
  const [finishErrors, setFinishErrors] = useState({});

  const [viewingInterview, setViewingInterview] = useState(null);
  const [showViewInterviewModal, setShowViewInterviewModal] = useState(false);

  return {
    activeTab, setActiveTab,
    showUserModal, setShowUserModal, editingUser, setEditingUser, userForm, setUserForm, userErrors, setUserErrors, showViewUserModal, setShowViewUserModal, viewingUser, setViewingUser, userFilterRole, setUserFilterRole,
    showClubModal, setShowClubModal, editingClub, setEditingClub, clubForm, setClubForm, showViewClubModal, setShowViewClubModal, viewingClub, setViewingClub, clubErrors, setClubErrors,
    showMemberModal, setShowMemberModal, editingMember, setEditingMember, memberForm, setMemberForm, viewingMember, setViewingMember, showViewMemberModal, setShowViewMemberModal, memberErrors, setMemberErrors,
    showEventModal, setShowEventModal, editingEvent, setEditingEvent, eventForm, setEventForm, viewingEvent, setViewingEvent, showViewEventModal, setShowViewEventModal, eventErrors, setEventErrors,
    showRegModal, setShowRegModal, editingReg, setEditingReg, regForm, setRegForm, viewingReg, setViewingReg, showViewRegModal, setShowViewRegModal, regErrors, setRegErrors,
    
    // Xuất State Campaign ra
    showCampaignModal, setShowCampaignModal, editingCampaign, setEditingCampaign, campaignForm, setCampaignForm, showViewCampaignModal, setShowViewCampaignModal, viewingCampaign, setViewingCampaign, campaignErrors, setCampaignErrors,

    showInterviewModal, setShowInterviewModal, editingInterview, setEditingInterview, interviewForm, setInterviewForm, interviewErrors, setInterviewErrors,
    showStartModal, setShowStartModal, startForm, setStartForm, startErrors, setStartErrors,
    showFinishModal, setShowFinishModal, finishForm, setFinishForm, finishErrors, setFinishErrors,
    viewingInterview, setViewingInterview, showViewInterviewModal, setShowViewInterviewModal
  };
};