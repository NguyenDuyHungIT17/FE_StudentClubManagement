import { useState, useEffect } from 'react';
import { clubService } from '../services/clubService';

export const useClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clubService.getAll();
      setClubs(data);
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const createClub = async (clubData) => {
    try {
      await clubService.create(clubData);
      alert("Thêm mới thành công!");
      fetchClubs();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  const updateClub = async (clubId, clubData) => {
    try {
      await clubService.update(clubId, clubData);
      alert("Cập nhật thành công!");
      fetchClubs();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  const deleteClub = async (clubId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa câu lạc bộ này?")) return false;
    try {
      await clubService.delete(clubId);
      alert("Xóa thành công");
      fetchClubs();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  return {
    clubs,
    loading,
    error,
    fetchClubs,
    createClub,
    updateClub,
    deleteClub,
  };
};