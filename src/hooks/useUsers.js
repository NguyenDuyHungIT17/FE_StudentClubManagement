import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States quản lý bảng
  const [keyword, setKeyword] = useState("");
  const [filterRole, setFilterRole] = useState("all"); // <-- Thêm state lọc Role
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState({ TotalPages: 1, TotalCount: 0 });

  // Thêm useCallback để tối ưu hiệu suất
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Truyền thêm filterRole vào API
      const response = await userService.getAll(keyword, filterRole, page, pageSize);
      console.log("2. TRẠM HOOK - Dữ liệu sau khi bóc tách:", response.data);
      setUsers(response.data || []); 
      setPaginationMeta(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [keyword, filterRole, page, pageSize]); // Tự động load lại khi 1 trong 4 biến này đổi

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); 

  const createUser = async (userData) => {
    try {
      await userService.create(userData);
      setPage(1); // Thêm mới xong thì quay về trang 1
      fetchUsers(); 
      return { success: true, message: "Thêm mới thành công!" };
    } catch (err) {
      if (err.isValidationError) return { success: false, validationErrors: err.errors };
      return { success: false, message: err.message };
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      await userService.update(userId, userData);
      fetchUsers();
      return { success: true, message: "Cập nhật thành công!" };
    } catch (err) {
      if (err.isValidationError) return { success: false, validationErrors: err.errors };
      return { success: false, message: err.message };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await userService.delete(userId);
      fetchUsers();
      return { success: true, message: "Xóa thành công!" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return {
    users, loading, error,
    keyword, setKeyword, 
    filterRole, setFilterRole, // <-- Trả ra ngoài cho Giao diện dùng
    page, setPage, 
    paginationMeta,
    fetchUsers, createUser, updateUser, deleteUser,
  };
};