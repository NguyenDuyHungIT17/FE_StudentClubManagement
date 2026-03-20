// src/services/eventRegistrationService.js
import { apiRequest, API_BASE_URL } from './api';

export const eventRegistrationService = {
  // LẤY DANH SÁCH THEO EVENT ID (Bắt buộc phải có eventId)
  getAllByEventId: async (eventId, keyword = "", pageNumber = 1, pageSize = 10) => {
    if (!eventId) return { data: [], pagination: { PageNumber: 1, TotalPages: 1, TotalCount: 0 } };

    const token = localStorage.getItem("token");
    const query = new URLSearchParams();
    if (keyword) query.append("KeyWord", keyword);
    query.append("PageNumber", pageNumber);
    query.append("PageSize", pageSize);

    const response = await fetch(`${API_BASE_URL}/EventRegistrations/event/${eventId}?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || result?.isSuccess === false) throw new Error(result?.message || "Lỗi lấy dữ liệu người tham gia");

    const paginationStr = response.headers.get('x-pagination');
    const pagination = paginationStr ? JSON.parse(paginationStr) : null;

    return {
      data: result.data || [],
      pagination: pagination || { PageNumber: 1, TotalPages: 1, TotalCount: result.data?.length || 0 }
    };
  },
  
  create: (data) => apiRequest('/EventRegistrations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiRequest(`/EventRegistrations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiRequest(`/EventRegistrations/${id}`, {
    method: 'DELETE',
  }),
};