import { useState } from 'react';
import { interviewService } from '../services/interviewService';

export const useInterviews = (clubId) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInterviews = async (selectedClubId) => {
    if (!selectedClubId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await interviewService.getByClub(selectedClubId);
      setInterviews(data);
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    interviews,
    loading,
    error,
    fetchInterviews,
    setInterviews,
  };
};