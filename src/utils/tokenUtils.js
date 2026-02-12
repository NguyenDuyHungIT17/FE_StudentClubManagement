/**
 * Lấy JWT token từ localStorage
 * @returns {string|null}
 */
export const getToken = () => {
  try {
    return localStorage.getItem('token') || localStorage.getItem('access_token');
  } catch {
    return null;
  }
};

/**
 * Decode JWT token (client-side, không verify signature)
 * @param {string} token
 * @returns {object|null}
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Lấy userId từ token
 * @returns {string|null}
 */
export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.sub || decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
};

/**
 * Kiểm tra token có hợp lệ không
 * @returns {boolean}
 */
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true; // Không có exp = valid
  
  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  return Date.now() < expirationTime;
};

/**
 * Lấy role từ token
 * @returns {string|null}
 */
export const getRoleFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
};