// Chỉ khai báo Base URL ở đây.
// Sau này deploy thật, bạn có thể thay bằng process.env.REACT_APP_API_URL
const API_BASE_URL = "http://localhost:5207/api";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  try {
    // Đảm bảo nối đúng Base URL với endpoint truyền vào
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const result = await response.json();

    if (!response.ok || result.isSuccess === false) {
      throw new Error(result.message || `Lỗi kết nối API (Status: ${response.status})`);
    }

    return result.data !== undefined ? result.data : result;

  } catch (error) {
    throw error;
  }
};