import { useState, useCallback } from 'react';
import { campaignService } from '../services/campaignService';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [filterClub, setFilterClub] = useState("all");
  const [filterIsActive, setFilterIsActive] = useState("all");
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({ TotalPages: 1, TotalCount: 0 });

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await campaignService.getAll(keyword, filterClub, filterIsActive, page, 10);
      setCampaigns(res.data);
      setPaginationMeta(res.pagination);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }, [keyword, filterClub, filterIsActive, page]);

  const handleApiCall = async (apiFunc, ...args) => {
    try {
      const res = await apiFunc(...args);
      fetchCampaigns();
      return { success: true, data: res };
    } catch (err) {
      if (err.isValidationError) return { success: false, validationErrors: err.errors };
      return { success: false, message: err.message };
    }
  };

  return {
    campaigns, loading, fetchCampaigns,
    keyword, setKeyword, filterClub, setFilterClub, filterIsActive, setFilterIsActive, page, setPage, paginationMeta,
    createCampaign: (data) => handleApiCall(campaignService.create, data),
    updateCampaign: (id, data) => handleApiCall(campaignService.update, id, data),
    deleteCampaign: (id) => handleApiCall(campaignService.delete, id)
  };
};