import { apiRequest } from './api';

export const userService = {
  
  getAll: () => apiRequest('/Users'),
  
  // Tạo user mới
  create: (userData) => apiRequest('/Users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }),
  
  // Cập nhật user
  update: (userId, userData) => apiRequest(`/Users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }),
  
  // Xóa user
  delete: (userId) => apiRequest(`/Users/${userId}`, {
    method: 'DELETE',
  }),
};