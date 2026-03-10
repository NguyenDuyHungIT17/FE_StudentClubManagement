// src/services/clubService.js
import { apiRequest } from './api';

export const clubService = {
  // Hàm GET đặc biệt: Lấy cả Data và Header Phân trang
getAll: async (keyword = "", pageNumber = 1, pageSize = 10) => {
    console.log("--- BƯỚC 1: Bắt đầu gọi API Clubs ---");
    const token = localStorage.getItem("token");
    
    const query = new URLSearchParams();
    if (keyword) query.append("KeyWord", keyword);
    query.append("PageNumber", pageNumber);
    query.append("PageSize", pageSize);

    try {
      const response = await fetch(`http://localhost:5207/api/Clubs?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
      });

      console.log("--- BƯỚC 2: Backend đã phản hồi. Status:", response.status, "---");

      // Đọc header NGAY LẬP TỨC trước khi làm chuyện khác
      const paginationStr = response.headers.get('x-pagination');
      console.log("--- BƯỚC 3: Chuỗi Header x-pagination:", paginationStr, "---");

      const result = await response.json();
      console.log("--- BƯỚC 4: Data lấy được:", result, "---");

      if (!response.ok || result.isSuccess === false) {
          throw new Error(result.message || "Lỗi từ Backend");
      }

      const pagination = paginationStr ? JSON.parse(paginationStr) : null;

      return {
        data: result.data || [],
        pagination: pagination || { PageNumber: 1, TotalPages: 1, TotalCount: 0 }
      };
    } catch (error) {
      console.error("!!! LỖI RỒI !!! Code đã chết tại đây:", error);
      throw error;
    }
  },
  
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