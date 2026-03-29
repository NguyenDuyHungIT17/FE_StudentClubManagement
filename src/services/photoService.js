import { API_BASE_URL } from './api';

const normalizePhotos = (response) => {
  const raw = response?.value || response?.data || response || [];
  return Array.isArray(raw) ? raw : [];
};

const selectBestPhotoUrl = (response, preferredTypes = []) => {
  const photos = normalizePhotos(response);
  if (photos.length === 0) return null;

  const byPreferredType = photos.find((p) => preferredTypes.includes(Number(p?.type)));
  if (byPreferredType?.url) return byPreferredType.url;

  return photos[0]?.url || null;
};

export const photoService = {
  upload: async (formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/Photos/upload`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || (data && data.isSuccess === false)) throw new Error(data?.message || "Lỗi khi tải lên");
    return data;
  },

  // 👉 THÊM HÀM UPDATE
  update: async (id, formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/Photos/${id}`, {
      method: 'PUT',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || (data && data.isSuccess === false)) throw new Error(data?.message || "Lỗi khi cập nhật");
    return data;
  },

  delete: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/Photos/${id}`, {
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.message || "Lỗi khi xóa");
    return data;
  },

  getByClub: async (clubId) => {
    const response = await fetch(`${API_BASE_URL}/Photos/club/${clubId}`);
    return await response.json().catch(() => null);
  },
  getByEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/Photos/event/${eventId}`);
    return await response.json().catch(() => null);
  },
  getByUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/Photos/user/${userId}`);
    return await response.json().catch(() => null);
  },
  getByClubMember: async (clubMemberId) => {
    const response = await fetch(`${API_BASE_URL}/Photos/clubmember/${clubMemberId}`);
    return await response.json().catch(() => null);
  },

  normalizePhotos,
  selectBestPhotoUrl,
};