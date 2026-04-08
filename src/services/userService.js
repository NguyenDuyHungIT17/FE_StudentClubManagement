import { apiRequest, API_BASE_URL } from './api';

export const userService = {
  // Thêm tham số role vào đây
  getAll: async (keyword = "", role = "all", pageNumber = 1, pageSize = 10, isActive) => {
    const token = localStorage.getItem("token");
    
    // Gắn params
    const query = new URLSearchParams();
    if (keyword) query.append("KeyWord", keyword);
    
    // NẾU ROLE KHÁC "all" THÌ MỚI GỬI LÊN BACKEND
    if (role && role !== "all") {
      query.append("Role", role); 
    }

    // Filter trạng thái (Active/Inactive) - backend nhận 0/1
    if (isActive !== undefined && isActive !== null && isActive !== "all") {
      const normalizedInt = (() => {
        if (typeof isActive === "number") return isActive === 1 ? 1 : 0;
        if (typeof isActive === "boolean") return isActive ? 1 : 0;
        const s = String(isActive).trim().toLowerCase();
        if (s === "1" || s === "true") return 1;
        if (s === "0" || s === "false") return 0;
        return undefined;
      })();

      if (normalizedInt !== undefined) {
        query.append("IsActive", String(normalizedInt));
      }
    }
    
    query.append("PageNumber", pageNumber);
    query.append("PageSize", pageSize);

    // Dùng fetch trực tiếp để đọc Header
    const response = await fetch(`${API_BASE_URL}/Users?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || result?.isSuccess === false) throw new Error(result?.message || "Lỗi lấy dữ liệu");

    // Đọc header phân trang
    const paginationStr = response.headers.get('x-pagination');
    const pagination = paginationStr ? JSON.parse(paginationStr) : null;

    return {
      data: result.data || [],
      pagination: pagination || { PageNumber: 1, TotalPages: 1, TotalCount: 0 }
    };
  },
  
  // Tạo user mới
  create: (userData) => apiRequest('/Users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Cập nhật user
  update: (userId, userData) => apiRequest(`/Users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  // Xóa user
  delete: (userId) => apiRequest(`/Users/${userId}`, {
    method: 'DELETE',
  }),
};