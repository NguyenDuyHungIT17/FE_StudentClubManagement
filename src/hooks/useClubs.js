// src/hooks/useClubs.js
import { useState, useEffect, useCallback } from 'react';
import { clubService } from '../services/clubService';

export const useClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // States cho Phân trang & Tìm kiếm
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState({ TotalPages: 1, TotalCount: 0 });

  // Hàm gọi API
  const fetchClubs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await clubService.getAll(keyword, page, pageSize);
      setClubs(response.data);
      setPaginationMeta(response.pagination);
    } catch (err) {
      console.error("Lỗi khi lấy CLB:", err);
    } finally {
      setLoading(false);
    }
  }, [keyword, page, pageSize]); // Tự động gọi lại nếu keyword hoặc page thay đổi

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  // Các hàm CRUD (Không chứa alert ở đây, chỉ trả về kết quả)
  const createClub = async (clubData) => {
    try {
      await clubService.create(clubData);
      setPage(1); // Tạo mới thì quay về trang 1 để xem
      fetchClubs(); 
      return { success: true, message: "Thêm câu lạc bộ thành công!" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateClub = async (clubId, clubData) => {
    try {
      await clubService.update(clubId, clubData);
      fetchClubs(); // Sửa xong load lại trang hiện tại
      return { success: true, message: "Cập nhật câu lạc bộ thành công!" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteClub = async (clubId) => {
    try {
      await clubService.delete(clubId);
      fetchClubs(); 
      return { success: true, message: "Xóa câu lạc bộ thành công!" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return { 
    clubs, loading, 
    keyword, setKeyword, 
    page, setPage, 
    paginationMeta,
    createClub, updateClub, deleteClub 
  };
};