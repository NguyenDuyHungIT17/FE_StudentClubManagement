import { apiRequest } from './api';

export const feedbackService = {
  createFeedback: (data) => apiRequest('/feedbacks', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getEventFeedbackByUser: (eventId, userId) => apiRequest(`/feedbacks/event/${eventId}/user/${userId}`, {
    method: 'GET',
  }),
};
