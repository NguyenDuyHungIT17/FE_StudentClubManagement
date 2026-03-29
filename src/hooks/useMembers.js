import { useState, useEffect, useCallback } from 'react';
import { memberService } from '../services/memberService';
import { photoService } from '../services/photoService';

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States quản lý bảng và Lọc kép
  const [filterClub, setFilterClub] = useState("all"); 
  const [filterRole, setFilterRole] = useState("all"); 
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState({ TotalPages: 1, TotalCount: 0 });

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await memberService.getAll(filterClub, filterRole, page, pageSize);
      const rawMembers = response.data || [];

      const membersWithPhoto = await Promise.all(
        rawMembers.map(async (member) => {
          try {
            const photoResponse = await photoService.getByClubMember(member.clubMemberId);
            const photoUrl = photoService.selectBestPhotoUrl(photoResponse, [1, 3, 2]);
            return { ...member, photoUrl };
          } catch {
            return { ...member, photoUrl: null };
          }
        })
      );

      setMembers(membersWithPhoto);
      setPaginationMeta(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterClub, filterRole, page, pageSize]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]); 

  const createMember = async (data) => {
    try {
      await memberService.create(data);
      setPage(1); 
      fetchMembers(); 
      return { success: true, message: "Thêm thành viên thành công!" };
    } catch (err) {
      if (err.isValidationError) return { success: false, validationErrors: err.errors };
      return { success: false, message: err.message };
    }
  };

  const updateMember = async (id, data) => {
    try {
      await memberService.update(id, data);
      fetchMembers();
      return { success: true, message: "Cập nhật thành công!" };
    } catch (err) {
      if (err.isValidationError) return { success: false, validationErrors: err.errors };
      return { success: false, message: err.message };
    }
  };

  const deleteMember = async (id) => {
    try {
      await memberService.delete(id);
      fetchMembers();
      return { success: true, message: "Xóa thành công!" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return {
    members, loading, error,
    filterClub, setFilterClub, 
    filterRole, setFilterRole,
    page, setPage, 
    paginationMeta,
    fetchMembers, createMember, updateMember, deleteMember,
  };
};