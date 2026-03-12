// src/hooks/useEvents.js
import { useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States quản lý bảng và Lọc kép
  const [keyword, setKeyword] = useState("");
  const [filterClub, setFilterClub] = useState("all"); 
  const [filterIsPrivate, setFilterIsPrivate] = useState("all"); // "all", "true" (Nội bộ), "false" (Công khai)
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState({ TotalPages: 1, TotalCount: 0 });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getAll(keyword, filterClub, filterIsPrivate, page, pageSize);
      setEvents(response.data || []); 
      setPaginationMeta(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [keyword, filterClub, filterIsPrivate, page, pageSize]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]); 

  const createEvent = async (data) => {
    try {
      await eventService.create(data);
      setPage(1); 
      fetchEvents(); 
      return { success: true, message: "Thêm Sự kiện thành công!" };
    } catch (err) {
      if (err.isValidationError) return { success: false, validationErrors: err.errors };
      return { success: false, message: err.message };
    }
  };

  const updateEvent = async (id, data) => {
    try {
      await eventService.update(id, data);
      fetchEvents();
      return { success: true, message: "Cập nhật thành công!" };
    } catch (err) {
      if (err.isValidationError) return { success: false, validationErrors: err.errors };
      return { success: false, message: err.message };
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventService.delete(id);
      fetchEvents();
      return { success: true, message: "Xóa thành công!" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return {
    events, loading, error,
    keyword, setKeyword,
    filterClub, setFilterClub, 
    filterIsPrivate, setFilterIsPrivate,
    page, setPage, 
    paginationMeta,
    fetchEvents, createEvent, updateEvent, deleteEvent,
  };
};