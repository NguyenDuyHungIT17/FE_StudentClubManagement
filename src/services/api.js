// src/services/api.js

// Chỉ khai báo Base URL ở đây.
// Sau này deploy thật, bạn có thể thay bằng process.env.REACT_APP_API_URL
export const API_BASE_URL = "http://localhost:5207/api";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    Accept: "application/json",
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers, // Ghi đè header nếu options có truyền vào
  };

  try {
    // Dùng API_BASE_URL thay vì hardcode localhost. 
    // endpoint truyền vào (VD: "/Users") sẽ tự động nối vào đuôi
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    
    // Parse JSON
    const data = await response.json().catch(() => null);

    // NẾU BACKEND TRẢ VỀ LỖI (Status code không nằm trong khoảng 200-299)
    if (!response.ok) {
      
      // 1. TRƯỜNG HỢP CÓ LỖI VALIDATION TỪNG Ô (Backend trả về object "errors")
      // Không quan tâm là 400, 409 hay 422. Cứ có errors là nhặt!
      if (data && data.errors && Object.keys(data.errors).length > 0) {
        let formattedErrors = {};
        
        for (let key in data.errors) {
          // Chuyển chữ cái đầu thành viết thường (Ví dụ: "Email" -> "email") để khớp với biến userForm
          let camelKey = key.charAt(0).toLowerCase() + key.slice(1);
          
          // Lấy câu thông báo lỗi (Lấy phần tử đầu tiên nếu nó là mảng)
          formattedErrors[camelKey] = Array.isArray(data.errors[key]) 
                                      ? data.errors[key][0] 
                                      : data.errors[key]; 
        }
        
        // Ném ra một object lỗi đặc biệt để bên ngoài (Hook) nhận diện được
        throw { isValidationError: true, errors: formattedErrors };
      }

      // 2. TRƯỜNG HỢP THÔNG BÁO LỖI CHUNG CHUNG
      // Thường gặp ở lỗi 401 Unauthorized, 404 Not Found, hoặc 500 Server Error
      const errorMessage = data?.message || data?.title || "Lỗi hệ thống từ máy chủ API";
      throw new Error(errorMessage);
    }

    // Nếu không có lỗi gì, trả về data cho Hook xử lý tiếp
    return data;
    
  } catch (err) {
    // Truyền lỗi ra ngoài để Hook bắt lấy
    throw err; 
  }
};