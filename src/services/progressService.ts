import { httpClient, API_ENDPOINTS } from '../config/api';

export interface ProgressStats {
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  urgentAssignments: number;
  completionPercentage: number;
  courseStats: {
    courseName: string;
    total: number;
    completed: number;
    percentage: number;
  }[];
}

export const progressService = {
  // Get progress statistics
  getProgressStats: async (): Promise<ProgressStats> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.PROGRESS_STATS);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching progress stats:', error);
      throw error;
    }
  }
};