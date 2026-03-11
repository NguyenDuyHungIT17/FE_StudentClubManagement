import { apiRequest, API_BASE_URL } from './api';

export const memberService = {
  // Lấy danh sách thành viên (Hỗ trợ phân trang, lọc theo ClubId và MemberRole)
  getAll: async (clubId = "all", memberRole = "all", pageNumber = 1, pageSize = 10) => {
    const token = localStorage.getItem("token");
    
    const query = new URLSearchParams();
    
    // Gắn tham số lọc nếu có chọn
    if (clubId && clubId !== "all") query.append("ClubId", clubId); 
    if (memberRole && memberRole !== "all") query.append("MemberRole", memberRole); 
    
    query.append("PageNumber", pageNumber);
    query.append("PageSize", pageSize);

    const response = await fetch(`${API_BASE_URL}/ClubMembers?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || result?.isSuccess === false) throw new Error(result?.message || "Lỗi lấy dữ liệu");

    // Đọc header phân trang
    const paginationStr = response.headers.get('x-pagination');
    const pagination = paginationStr ? JSON.parse(paginationStr) : null;

    return {
      data: result.data || [],
      pagination: pagination || { PageNumber: 1, TotalPages: 1, TotalCount: result.data?.length || 0 }
    };
  },
  
  create: (data) => apiRequest('/ClubMembers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiRequest(`/ClubMembers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiRequest(`/ClubMembers/${id}`, {
    method: 'DELETE',
  }),
};