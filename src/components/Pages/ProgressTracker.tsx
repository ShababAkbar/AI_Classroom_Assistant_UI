import React, { useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { Assignment } from '../../types';
import { AssignmentCard } from '../Common/AssignmentCard';
import { ProgressBar } from '../Common/ProgressBar';
import { RadialProgress } from '../Common/RadialProgress';
import { useApi, useApiMutation } from '../../hooks/useApi';
import { assignmentService } from '../../services/assignmentService';

export const ProgressTracker: React.FC = () => {
  const [showCompleted, setShowCompleted] = useState(false);

  // Fetch assignments from backend
  const { 
    data: assignments, 
    loading, 
    error,
    refetch 
  } = useApi(() => assignmentService.getAssignments());

  // Mutation for updating assignment status
  const { mutate: updateStatus, loading: updating } = useApiMutation<Assignment, { id: string; status: 'pending' | 'completed' }>();

  const handleToggleStatus = async (id: string) => {
    try {
      const assignment = assignments?.find(a => a.id === id);
      if (!assignment) return;

      const newStatus = assignment.status === 'completed' ? 'pending' : 'completed';
      await updateStatus(
        ({ id, status }) => assignmentService.updateAssignmentStatus(id, status),
        { id, status: newStatus }
      );
      
      // Refresh the assignments list
      await refetch();
    } catch (error) {
      console.error('Error updating assignment status:', error);
      // You can add a toast notification here
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Assignments</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredAssignments = (assignments || []).filter(assignment => 
    showCompleted ? assignment.status === 'completed' : assignment.status === 'pending'
  );

  const completedCount = (assignments || []).filter(a => a.status === 'completed').length;
  const totalCount = (assignments || []).length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracker</h1>
        <p className="text-gray-600">Track your assignment completion progress</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Overall Progress</h2>
            <div className="space-y-4">
              <ProgressBar
                progress={progressPercentage}
                label="Completion Rate"
                color="bg-gradient-to-r from-blue-500 to-green-500"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Completed: {completedCount}</span>
                <span>Total: {totalCount}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <RadialProgress
              progress={progressPercentage}
              size={160}
              strokeWidth={12}
              label="Overall"
            />
          </div>
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">View Assignments</h2>
          
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${!showCompleted ? 'text-blue-600' : 'text-gray-500'}`}>
              Pending ({(assignments || []).filter(a => a.status === 'pending').length})
            </span>
            
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center p-1 bg-gray-100 rounded-full transition-colors duration-200 hover:bg-gray-200"
            >
              {showCompleted ? (
                <ToggleRight className="w-8 h-8 text-green-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-gray-400" />
              )}
            </button>
            
            <span className={`text-sm font-medium ${showCompleted ? 'text-green-600' : 'text-gray-500'}`}>
              Completed ({(assignments || []).filter(a => a.status === 'completed').length})
            </span>
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {showCompleted ? 'Completed' : 'Pending'} Assignments ({filteredAssignments.length})
        </h3>
        
        {filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onToggleStatus={updating ? undefined : handleToggleStatus}
                showToggle={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400">📋</span>
            </div>
            <p className="text-gray-500">
              No {showCompleted ? 'completed' : 'pending'} assignments found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};