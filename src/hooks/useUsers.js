import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (userData) => {
    try {
      await userService.create(userData);
      alert("Thêm mới thành công!");
      fetchUsers();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      await userService.update(userId, userData);
      alert("Cập nhật thành công!");
      fetchUsers();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return false;
    try {
      await userService.delete(userId);
      alert("Xóa thành công!");
      fetchUsers();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};