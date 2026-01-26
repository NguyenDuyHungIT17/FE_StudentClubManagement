import { apiRequest } from './api';

export const clubService = {
  getAll: () => apiRequest('/Clubs'),
  
  create: (clubData) => apiRequest('/Clubs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clubData),
  }),
  
  update: (clubId, clubData) => apiRequest(`/Clubs/${clubId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clubData),
  }),
  
  delete: (clubId) => apiRequest(`/Clubs/${clubId}`, {
    method: 'DELETE',
  }),
};