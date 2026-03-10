import { apiRequest, API_BASE_URL } from './api';

export const memberService = {
  // Lấy danh sách kèm phân trang, tìm kiếm và lọc theo Club
  getAll: async (keyword = "", clubId = "all", pageNumber = 1, pageSize = 10) => {
    const token = localStorage.getItem("token");
    
    const query = new URLSearchParams();
    if (keyword) query.append("KeyWord", keyword);
    if (clubId && clubId !== "all") query.append("ClubId", clubId); 
    query.append("PageNumber", pageNumber);
    query.append("PageSize", pageSize);

    const response = await fetch(`${API_BASE_URL}/Members?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || result?.isSuccess === false) throw new Error(result?.message || "Lỗi lấy dữ liệu");

    const paginationStr = response.headers.get('x-pagination');
    const pagination = paginationStr ? JSON.parse(paginationStr) : null;

    return {
      data: result.data || [],
      pagination: pagination || { PageNumber: 1, TotalPages: 1, TotalCount: 0 }
    };
  },
  
  create: (data) => apiRequest('/Members', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiRequest(`/Members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiRequest(`/Members/${id}`, {
    method: 'DELETE',
  }),
};