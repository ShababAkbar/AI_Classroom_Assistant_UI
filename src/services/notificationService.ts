import { httpClient, API_ENDPOINTS } from '../config/api';
import { Notification } from '../types';

export const notificationService = {
  // Get all notifications
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.NOTIFICATIONS);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Send test notification
  sendTestNotification: async (channel: 'email' | 'whatsapp' | 'both'): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.SEND_TEST_NOTIFICATION, { channel });
      return response;
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }
};