import { apiRequest, API_BASE_URL } from './api';

export const interviewService = {
  getAll: async (keyword = "", clubId = "all", campaignId = "all", status = "all", result = "all", pageNumber = 1, pageSize = 100) => {
    const token = localStorage.getItem("token");
    const query = new URLSearchParams();
    if (keyword) query.append("keyword", keyword);
    if (clubId && clubId !== "all") query.append("clubId", clubId);
    if (campaignId && campaignId !== "all") query.append("campaignId", campaignId);
    if (status && status !== "all") query.append("status", status);
    if (result && result !== "all") query.append("result", result);
    query.append("pageNumber", pageNumber);
    query.append("pageSize", pageSize);

    const response = await fetch(`${API_BASE_URL}/interviews?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });

    // 1. ĐỌC PHÂN TRANG TỪ HEADER
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
    if (!response.ok) throw new Error("Lỗi lấy dữ liệu phỏng vấn");

    return {
      // 2. LẤY MẢNG DỮ LIỆU TỪ TRƯỜNG .data
      data: resData?.data || resData?.items || [],
      pagination: paginationMeta
    };
  },
  
  getById: (id) => apiRequest(`/interviews/${id}`, { method: 'GET' }),
  createWalkIn: (data) => apiRequest('/interviews/walkin', { method: 'POST', body: JSON.stringify(data) }),
  createWeb: async (data) => {
    const response = await fetch(`${API_BASE_URL}/interviews/web`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || result?.isSuccess === false) {
      throw new Error(result?.message || 'Gửi hồ sơ thất bại');
    }
    return result;
  },
  update: (id, data) => apiRequest(`/interviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/interviews/${id}`, { method: 'DELETE' }),
  checkIn: (id) => apiRequest(`/interviews/${id}/checkin`, { method: 'POST', body: JSON.stringify({}) }),
  start: (id, data) => apiRequest(`/interviews/${id}/start`, { method: 'POST', body: JSON.stringify(data) }),
  finish: (id, data) => apiRequest(`/interviews/${id}/finish`, { method: 'POST', body: JSON.stringify(data) }),
  noShow: (id) => apiRequest(`/interviews/${id}/noshow`, { method: 'POST', body: JSON.stringify({}) }),
  cancel: (id) => apiRequest(`/interviews/${id}/cancel`, { method: 'POST', body: JSON.stringify({}) }),
  updateResultAfter: (id, data) => apiRequest(`/interviews/${id}/after-result`, { method: 'PUT', body: JSON.stringify(data) }),
  sendEmail: (clubId, resultType) => apiRequest(`/interviews/club/${clubId}/send-email/${resultType}`, { method: 'POST', body: JSON.stringify({}) }),
};