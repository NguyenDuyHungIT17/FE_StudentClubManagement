const API_URL = "http://localhost:5207/api/Auth";

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Email hoặc mật khẩu không chính xác.");
        return null;
    }
    return response.json();
    
}