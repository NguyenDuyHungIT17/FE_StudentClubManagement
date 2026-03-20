// src/hooks/useEventRegistrations.js
import { useState, useEffect, useCallback } from 'react';
import { eventRegistrationService } from '../services/eventRegistrationService';

export const useEventRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States quản lý bảng
  const [selectedEventId, setSelectedEventId] = useState(""); // Cực kỳ quan trọng
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState({ TotalPages: 1, TotalCount: 0 });

  const fetchRegistrations = useCallback(async () => {
    if (!selectedEventId) {
      setRegistrations([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await eventRegistrationService.getAllByEventId(selectedEventId, keyword, page, pageSize);
      setRegistrations(response.data || []); 
      setPaginationMeta(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedEventId, keyword, page, pageSize]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]); 

  const createRegistration = async (data) => {
    try {
      await eventRegistrationService.create(data);
      setPage(1); 
      fetchRegistrations(); 
      return { success: true, message: "Thêm thành công!" };
    } catch (err) {
      if (err.isValidationError) return { success: false, validationErrors: err.errors };
      return { success: false, message: err.message };
    }
  };

  const updateRegistration = async (id, data) => {
    try {
      await eventRegistrationService.update(id, data);
      fetchRegistrations();
      return { success: true, message: "Cập nhật thành công!" };
    } catch (err) {
      if (err.isValidationError) return { success: false, validationErrors: err.errors };
      return { success: false, message: err.message };
    }
  };

  const deleteRegistration = async (id) => {
    try {
      await eventRegistrationService.delete(id);
      fetchRegistrations();
      return { success: true, message: "Xóa thành công!" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return {
    registrations, loading, error,
    selectedEventId, setSelectedEventId,
    keyword, setKeyword,
    page, setPage, 
    paginationMeta,
    fetchRegistrations, createRegistration, updateRegistration, deleteRegistration,
  };
};