import { useState, useCallback } from 'react';
import { interviewService } from '../services/interviewService';

export const useInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [filterClub, setFilterClub] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResult, setFilterResult] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100); 
  const [paginationMeta, setPaginationMeta] = useState({ TotalPages: 1, TotalCount: 0 });
const [filterCampaign, setFilterCampaign] = useState("all");
  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    try {
     const response = await interviewService.getAll(keyword, filterClub, filterCampaign, filterStatus, filterResult, page, pageSize);
      setInterviews(response.data || []);
      setPaginationMeta(response.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [keyword, filterClub, filterCampaign, filterStatus, filterResult, page, pageSize]);

  const handleApiCall = async (apiFunc, ...args) => {
    try {
      const res = await apiFunc(...args);
      fetchInterviews();
      return { success: true, data: res };
    } catch (err) {
      if (err.isValidationError) return { success: false, validationErrors: err.errors };
      return { success: false, message: err.message };
    }
  };

  return {
    interviews, loading,
    keyword, setKeyword, filterClub, setFilterClub, 
    filterStatus, setFilterStatus, filterResult, setFilterResult,
    page, setPage, paginationMeta, fetchInterviews,
    
    getInterviewById: async (id) => {
      try {
        const res = await interviewService.getById(id);
        return { success: true, data: res.data };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    createWalkIn: (data) => handleApiCall(interviewService.createWalkIn, data),
    updateInterview: (id, data) => handleApiCall(interviewService.update, id, data),
    deleteInterview: (id) => handleApiCall(interviewService.delete, id),
    checkIn: (id) => handleApiCall(interviewService.checkIn, id),
    startInterview: (id, data) => handleApiCall(interviewService.start, id, data),
    finishInterview: (id, data) => handleApiCall(interviewService.finish, id, data),
    noShow: (id) => handleApiCall(interviewService.noShow, id),
    cancelInterview: (id) => handleApiCall(interviewService.cancel, id),
    filterCampaign, setFilterCampaign,
    updateResultAfterInterview: (id, data) => handleApiCall(interviewService.updateResultAfter, id, data), // 👉 HÀM MỚI
    sendEmails: (clubId, type) => handleApiCall(interviewService.sendEmail, clubId, type)
  };
};