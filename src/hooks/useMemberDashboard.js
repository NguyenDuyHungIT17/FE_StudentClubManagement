import { useState, useEffect } from "react";
import { decodeToken } from "../utils/tokenUtils";

// Hook quản lý toàn bộ logic của Dashboard
export const useMemberDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  
  // User info
  const token = localStorage.getItem("token");
  const fullName = localStorage.getItem("fullName") || "Alex Morgan"; // Default giống ảnh
  const decodedToken = decodeToken(token);
  const userClubId = decodedToken?.clubId || null;

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Giả lập hoặc gọi API thật
      const res = await fetch("https://localhost:7251/api/Event", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEvents(data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const res = await fetch("https://localhost:7251/api/EventRegistrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: parseInt(localStorage.getItem("userId") || "0"),
          checkName: fullName
        })
      });
      if (res.ok) {
        setRegisteredEventIds(prev => [...prev, eventId]);
        alert("Registered successfully!");
      }
    } catch (err) { alert("Registration failed"); }
  };

  return {
    events,
    loading,
    registeredEventIds,
    handleRegister,
    userData: { fullName, token, userClubId },
    fetchData // Trả về để có thể reload nếu cần
  };
};