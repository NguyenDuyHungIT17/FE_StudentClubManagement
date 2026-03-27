import { apiRequest, API_BASE_URL } from './api';

export const campaignService = {
  getAll: async (keyword = "", clubId = "all", isActive = "all", pageNumber = 1, pageSize = 100) => {
    const token = localStorage.getItem("token");
    const query = new URLSearchParams();
    if (keyword) query.append("keyword", keyword);
    if (clubId && clubId !== "all") query.append("clubId", clubId);
    if (isActive && isActive !== "all") query.append("isActive", isActive === "true");
    query.append("pageNumber", pageNumber);
    query.append("pageSize", pageSize);

    const response = await fetch(`${API_BASE_URL}/Campaign?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });

    // 1. ĐỌC PHÂN TRANG TỪ HEADER (Giống như BE của bạn đã viết)
    let paginationMeta = { PageNumber: 1, TotalPages: 1, TotalCount: 0 };
    const paginationHeader = response.headers.get("X-Pagination");
    if (paginationHeader) {
      try {
        const parsed = JSON.parse(paginationHeader);
        paginationMeta = { 
          PageNumber: parsed.PageNumber || parsed.pageNumber || 1, 
          TotalPages: parsed.TotalPages || parsed.totalPages || 1, 
          TotalCount: parsed.TotalCount || parsed.totalCount || 0 
        };
      } catch(e) {}
    }

    const resData = await response.json().catch(() => null);
    if (!response.ok) throw new Error("Lỗi lấy dữ liệu chiến dịch");

    return {
      // 2. ĐỌC DỮ LIỆU TỪ TRƯỜNG .data (Vì Backend bọc trong ApiResponse)
      data: resData?.data || resData?.items || [],
      pagination: paginationMeta
    };
  },
  getById: (id) => apiRequest(`/Campaign/${id}`, { method: 'GET' }),
  create: (data) => apiRequest('/Campaign', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/Campaign/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/Campaign/${id}`, { method: 'DELETE' }),
};