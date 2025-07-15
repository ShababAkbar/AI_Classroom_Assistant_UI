import { httpClient, API_ENDPOINTS } from '../config/api';
import { Assignment } from '../types';

export const assignmentService = {
  // Get all assignments
  getAssignments: async (): Promise<Assignment[]> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.ASSIGNMENTS);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  // Get assignment by ID
  getAssignmentById: async (id: string): Promise<Assignment> => {
    try {
      const url = API_ENDPOINTS.ASSIGNMENT_BY_ID.replace(':id', id);
      const response = await httpClient.get(url);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  },

  // Update assignment status
  updateAssignmentStatus: async (id: string, status: 'pending' | 'completed'): Promise<Assignment> => {
    try {
      const url = API_ENDPOINTS.UPDATE_ASSIGNMENT_STATUS.replace(':id', id);
      const response = await httpClient.put(url, { status });
      return response.data || response;
    } catch (error) {
      console.error('Error updating assignment status:', error);
      throw error;
    }
  },

  // Sync with Google Classroom
  syncWithClassroom: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.SYNC_CLASSROOM);
      return response;
    } catch (error) {
      console.error('Error syncing with classroom:', error);
      throw error;
    }
  },

  // Get classroom sync status
  getClassroomStatus: async (): Promise<{ isConnected: boolean; lastSync: string }> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.CLASSROOM_STATUS);
      return response;
    } catch (error) {
      console.error('Error getting classroom status:', error);
      throw error;
    }
  }
};