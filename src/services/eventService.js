// src/services/eventService.js
import { apiRequest, API_BASE_URL } from './api';

export const eventService = {
  // Lấy danh sách Sự kiện (Phân trang, Tìm kiếm, Lọc theo Club và Trạng thái Private)
  getAll: async (keyword = "", clubId = "all", isPrivate = "all", pageNumber = 1, pageSize = 10) => {
    const token = localStorage.getItem("token");
    
    const query = new URLSearchParams();
    if (keyword) query.append("Keyword", keyword);
    if (clubId && clubId !== "all") query.append("ClubId", clubId); 
    
    // API nhận boolean, nên nếu khác "all" thì ta truyền true/false
    if (isPrivate !== "all") {
      query.append("IsPrivate", isPrivate === "true");
    }
    
    query.append("PageNumber", pageNumber);
    query.append("PageSize", pageSize);

    const response = await fetch(`${API_BASE_URL}/Event?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || result?.isSuccess === false) throw new Error(result?.message || "Lỗi lấy dữ liệu Sự kiện");

    const paginationStr = response.headers.get('x-pagination');
    const pagination = paginationStr ? JSON.parse(paginationStr) : null;

    return {
      data: result.data || [],
      pagination: pagination || { PageNumber: 1, TotalPages: 1, TotalCount: result.data?.length || 0 }
    };
  },
  
  create: (data) => apiRequest('/Event', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiRequest(`/Event/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiRequest(`/Event/${id}`, {
    method: 'DELETE',
  }),
};