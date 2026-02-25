// src/hooks/useDashboardUI.js
import { useState } from "react";

export const useDashboardUI = () => {
  const [activeTab, setActiveTab] = useState("users");

  // --- TRẠNG THÁI FORM USER ---
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ fullName: "", email: "", password: "", role: "member", isActive: 1 });
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  // --- BỘ LỌC CHUNG ---
  const [userFilterRole, setUserFilterRole] = useState("all");

  return {
    activeTab, setActiveTab,
    
    showUserModal, setShowUserModal,
    editingUser, setEditingUser,
    userForm, setUserForm,
    
    showViewUserModal, setShowViewUserModal,
    viewingUser, setViewingUser,
    
    userFilterRole, setUserFilterRole
  };
};