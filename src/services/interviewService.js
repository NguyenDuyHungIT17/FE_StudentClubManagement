import { apiRequest } from './api';

export const interviewService = {
  getByClub: (clubId) => apiRequest(`/Interviews/club/${clubId}`),
  
  create: (interviewData) => apiRequest('/Interviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(interviewData),
  }),
  
  update: (interviewId, interviewData) => apiRequest(`/Interviews/${interviewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(interviewData),
  }),
};