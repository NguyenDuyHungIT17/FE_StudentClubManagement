import { apiRequest } from './api';

export const userService = {
  getAll: () => apiRequest('/Users'),
  
  create: (userData) => apiRequest('/Users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }),
  
  update: (userId, userData) => apiRequest(`/Users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }),
  
  delete: (userId) => apiRequest(`/Users/${userId}`, {
    method: 'DELETE',
  }),
};