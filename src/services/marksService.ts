import { httpClient, API_ENDPOINTS } from '../config/api';
import { MarksEntry } from '../types';

export const marksService = {
  // Get all marks entries
  getMarks: async (): Promise<MarksEntry[]> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.MARKS);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching marks:', error);
      throw error;
    }
  },

  // Get marks by course
  getMarksByCourse: async (courseId: string): Promise<MarksEntry[]> => {
    try {
      const url = API_ENDPOINTS.MARKS_BY_COURSE.replace(':courseId', courseId);
      const response = await httpClient.get(url);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching marks by course:', error);
      throw error;
    }
  },

  // Add new marks entry
  addMarks: async (marksData: Omit<MarksEntry, 'id' | 'dateAdded'>): Promise<MarksEntry> => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.ADD_MARKS, marksData);
      return response.data || response;
    } catch (error) {
      console.error('Error adding marks:', error);
      throw error;
    }
  },

  // Update marks entry
  updateMarks: async (id: string, marksData: Partial<MarksEntry>): Promise<MarksEntry> => {
    try {
      const url = API_ENDPOINTS.UPDATE_MARKS.replace(':id', id);
      const response = await httpClient.put(url, marksData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating marks:', error);
      throw error;
    }
  },

  // Delete marks entry
  deleteMarks: async (id: string): Promise<{ success: boolean }> => {
    try {
      const url = API_ENDPOINTS.DELETE_MARKS.replace(':id', id);
      const response = await httpClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error deleting marks:', error);
      throw error;
    }
  }
};