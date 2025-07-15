import { httpClient, API_ENDPOINTS } from '../config/api';
import { Course } from '../types';

export const courseService = {
  // Get all courses
  getCourses: async (): Promise<Course[]> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.COURSES);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }
};