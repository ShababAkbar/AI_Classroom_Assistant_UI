import { httpClient, API_ENDPOINTS } from '../config/api';
import { UserSettings } from '../types';

export const settingsService = {
  // Get user settings
  getUserSettings: async (): Promise<UserSettings> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.USER_SETTINGS);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  },

  // Update user settings
  updateUserSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    try {
      const response = await httpClient.put(API_ENDPOINTS.UPDATE_SETTINGS, settings);
      return response.data || response;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }
};