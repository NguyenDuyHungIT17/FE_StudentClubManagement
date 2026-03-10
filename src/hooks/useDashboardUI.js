// src/hooks/useDashboardUI.js
import { useState } from "react";

export const useDashboardUI = () => {
  const [activeTab, setActiveTab] = useState("users");

  // --- TRẠNG THÁI FORM USER ---
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userErrors, setUserErrors] = useState({});
  const [userForm, setUserForm] = useState({ fullName: "", email: "", password: "", role: "member", isActive: 1 });
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  // --- TRẠNG THÁI FORM CLUB (MỚI THÊM) ---
  const [showClubModal, setShowClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  // Thêm 'title' vào state khởi tạo
  const [clubForm, setClubForm] = useState({ clubName: "", title: "", description: "", leaderId: "" });
  const [showViewClubModal, setShowViewClubModal] = useState(false);
  const [viewingClub, setViewingClub] = useState(null);
  const [clubErrors, setClubErrors] = useState({});

  // --- BỘ LỌC CHUNG ---
  const [userFilterRole, setUserFilterRole] = useState("all");

  return {
    activeTab, setActiveTab,
    
    showUserModal, setShowUserModal,
    editingUser, setEditingUser,
    userForm, setUserForm,
    
    userErrors, setUserErrors,

    showViewUserModal, setShowViewUserModal,
    viewingUser, setViewingUser,
    
    userFilterRole, setUserFilterRole,

    // Club
    showClubModal, setShowClubModal, editingClub, setEditingClub,
    clubForm, setClubForm, showViewClubModal, setShowViewClubModal,
    viewingClub, setViewingClub,
    clubErrors, setClubErrors
  };
};