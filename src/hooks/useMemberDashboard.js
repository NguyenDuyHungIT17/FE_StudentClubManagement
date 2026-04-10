import { useState, useEffect } from "react";
import { decodeToken, getToken, getUserIdFromToken } from "../utils/tokenUtils";
import { eventService } from "../services/eventService";
import { eventRegistrationService } from "../services/eventRegistrationService";

// Hook quản lý toàn bộ logic của Dashboard
export const useMemberDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  
  // User info
  const token = getToken();
  const fullName = localStorage.getItem("fullName") || "Alex Morgan"; // Default giống ảnh
  const decodedToken = decodeToken(token);
  const userClubId = decodedToken?.clubId || null;
  const userIdFromToken = getUserIdFromToken();

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Dùng service chung để tránh lệch format response
      const result = await eventService.getAll("", "all", "all", 1, 200);
      setEvents(Array.isArray(result?.data) ? result.data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const fallbackUserId = localStorage.getItem("userId");
      const userId = parseInt(String(userIdFromToken || fallbackUserId || "0"), 10);
      await eventRegistrationService.create({
        eventId,
        userId,
        checkName: fullName,
      });

      if (!registeredEventIds.includes(eventId)) {
        setRegisteredEventIds(prev => [...prev, eventId]);
      }

      alert("Registered successfully!");
    } catch (err) {
      alert(err?.message || "Registration failed");
    }
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