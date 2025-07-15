import React, { useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Award, BarChart3 } from 'lucide-react';
import { MarksEntry } from '../../types';
import { RadialProgress } from '../Common/RadialProgress';
import { useApi, useApiMutation } from '../../hooks/useApi';
import { marksService } from '../../services/marksService';
import { courseService } from '../../services/courseService';

export const MarksSummary: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    assignmentName: '',
    course: '',
    marksObtained: '',
    totalMarks: '100'
  });

  // Fetch marks and courses from backend
  const { 
    data: marksEntries, 
    loading: marksLoading, 
    error: marksError,
    refetch: refetchMarks 
  } = useApi(() => marksService.getMarks());

  const { 
    data: courses, 
    loading: coursesLoading, 
    error: coursesError 
  } = useApi(() => courseService.getCourses());

  // Mutations
  const { mutate: addMarksMutation, loading: adding } = useApiMutation<MarksEntry, Omit<MarksEntry, 'id' | 'dateAdded'>>();
  const { mutate: updateMarksMutation, loading: updating } = useApiMutation<MarksEntry, { id: string; data: Partial<MarksEntry> }>();
  const { mutate: deleteMarksMutation, loading: deleting } = useApiMutation<{ success: boolean }, string>();

  const calculateCourseAverage = (courseName: string) => {
    const courseEntries = (marksEntries || []).filter(entry => entry.course === courseName);
    if (courseEntries.length === 0) return 0;
    
    const total = courseEntries.reduce((sum, entry) => sum + (entry.marksObtained / entry.totalMarks) * 100, 0);
    return total / courseEntries.length;
  };

  const courseStats = (courses || []).map(course => ({
    ...course,
    average: calculateCourseAverage(course.name),
    totalAssignments: (marksEntries || []).filter(entry => entry.course === course.name).length
  }));

  const handleAddEntry = async () => {
    if (newEntry.assignmentName && newEntry.course && newEntry.marksObtained && newEntry.totalMarks) {
      try {
        const entryData = {
          assignmentName: newEntry.assignmentName,
          course: newEntry.course,
          marksObtained: parseInt(newEntry.marksObtained),
          totalMarks: parseInt(newEntry.totalMarks)
        };
        
        await addMarksMutation(
          (data) => marksService.addMarks(data),
          entryData
        );
        
        // Reset form and refresh data
        setNewEntry({ assignmentName: '', course: '', marksObtained: '', totalMarks: '100' });
        setShowAddForm(false);
        await refetchMarks();
      } catch (error) {
        console.error('Error adding marks entry:', error);
        // You can add a toast notification here
      }
    }
  };

  const handleUpdateEntry = async (id: string, marks: number) => {
    try {
      await updateMarksMutation(
        ({ id, data }) => marksService.updateMarks(id, data),
        { id, data: { marksObtained: marks } }
      );
      
      setEditingId(null);
      await refetchMarks();
    } catch (error) {
      console.error('Error updating marks entry:', error);
      // You can add a toast notification here
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteMarksMutation(
          (id) => marksService.deleteMarks(id),
          id
        );
        
        await refetchMarks();
      } catch (error) {
        console.error('Error deleting marks entry:', error);
        // You can add a toast notification here
      }
    }
  };

  // Loading state
  if (marksLoading || coursesLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (marksError || coursesError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Data</h3>
          <p className="text-red-600 text-sm mb-4">{marksError || coursesError}</p>
          <button
            onClick={() => {
              refetchMarks();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredEntries = selectedCourse 
    ? (marksEntries || []).filter(entry => entry.course === selectedCourse)
    : (marksEntries || []);

  if (selectedCourse === null) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marks Summary</h1>
          <p className="text-gray-600">Track your academic performance across all courses</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{(marksEntries || []).length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {(marksEntries || []).length > 0 
                    ? Math.round((marksEntries || []).reduce((sum, entry) => sum + (entry.marksObtained / entry.totalMarks) * 100, 0) / (marksEntries || []).length)
                    : 0}%
                </p>
              </div>
              <Award className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-purple-600">{courseStats.filter(c => c.totalAssignments > 0).length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Radial Progress Charts */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Course Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseStats.filter(course => course.totalAssignments > 0).map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col items-center">
                  <RadialProgress
                    progress={course.average}
                    size={120}
                    strokeWidth={10}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mt-4 text-center">{course.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.totalAssignments} assignments</p>
                  <button
                    onClick={() => setSelectedCourse(course.name)}
                    className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">All Courses</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseStats.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.name)}
                  className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{course.name}</h3>
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: course.color }}></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {course.totalAssignments} assignments
                  </p>
                  {course.totalAssignments > 0 && (
                    <p className="text-sm font-medium text-green-600">
                      Average: {Math.round(course.average)}%
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setSelectedCourse(null)}
          className="text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
        >
          ← Back to All Courses
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCourse}</h1>
        <p className="text-gray-600">Assignment marks and performance tracking</p>
      </div>

      {/* Add New Assignment Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          disabled={adding}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          {adding ? 'Adding...' : 'Add New Assignment'}
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Assignment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Name</label>
                <input
                  type="text"
                  value={newEntry.assignmentName}
                  onChange={(e) => setNewEntry({...newEntry, assignmentName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  value={newEntry.course}
                  onChange={(e) => setNewEntry({...newEntry, course: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Course</option>
                  {(courses || []).map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    value={newEntry.marksObtained}
                    onChange={(e) => setNewEntry({...newEntry, marksObtained: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={newEntry.totalMarks}
                    onChange={(e) => setNewEntry({...newEntry, totalMarks: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddEntry}
                disabled={adding}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add Assignment'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                disabled={adding}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
        </div>
        
        {filteredEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{entry.assignmentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === entry.id ? (
                        <input
                          type="number"
                          defaultValue={entry.marksObtained}
                          onBlur={(e) => handleUpdateEntry(entry.id, parseInt(e.target.value))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateEntry(entry.id, parseInt(e.currentTarget.value));
                            }
                          }}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                          disabled={updating}
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{entry.marksObtained}/{entry.totalMarks}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        (entry.marksObtained / entry.totalMarks) * 100 >= 80 ? 'text-green-600' :
                        (entry.marksObtained / entry.totalMarks) * 100 >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {Math.round((entry.marksObtained / entry.totalMarks) * 100)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(entry.dateAdded).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingId(entry.id)}
                          disabled={updating || deleting}
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          disabled={updating || deleting}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No assignments found for this course</p>
          </div>
        )}
      </div>
    </div>
  );
};
        assignmentName: newEntry.assignmentName,
        course: newEntry.course,
        marksObtained: parseInt(newEntry.marksObtained),
        totalMarks: parseInt(newEntry.totalMarks),
        dateAdded: new Date()
      };
      
      setMarksEntries([...marksEntries, entry]);
      setNewEntry({ assignmentName: '', course: '', marksObtained: '', totalMarks: '100' });
      setShowAddForm(false);
    }
  };

  const handleUpdateEntry = (id: string, marks: number) => {
    setMarksEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, marksObtained: marks } : entry
      )
    );
    setEditingId(null);
  };

  const handleDeleteEntry = (id: string) => {
    setMarksEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const filteredEntries = selectedCourse 
    ? marksEntries.filter(entry => entry.course === selectedCourse)
    : marksEntries;

  if (selectedCourse === null) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marks Summary</h1>
          <p className="text-gray-600">Track your academic performance across all courses</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{marksEntries.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(marksEntries.reduce((sum, entry) => sum + (entry.marksObtained / entry.totalMarks) * 100, 0) / marksEntries.length)}%
                </p>
              </div>
              <Award className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-purple-600">{courseStats.filter(c => c.totalAssignments > 0).length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Radial Progress Charts */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Course Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseStats.filter(course => course.totalAssignments > 0).map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col items-center">
                  <RadialProgress
                    progress={course.average}
                    size={120}
                    strokeWidth={10}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mt-4 text-center">{course.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.totalAssignments} assignments</p>
                  <button
                    onClick={() => setSelectedCourse(course.name)}
                    className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">All Courses</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseStats.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.name)}
                  className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{course.name}</h3>
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: course.color }}></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {course.totalAssignments} assignments
                  </p>
                  {course.totalAssignments > 0 && (
                    <p className="text-sm font-medium text-green-600">
                      Average: {Math.round(course.average)}%
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setSelectedCourse(null)}
          className="text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
        >
          ← Back to All Courses
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCourse}</h1>
        <p className="text-gray-600">Assignment marks and performance tracking</p>
      </div>

      {/* Add New Assignment Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          Add New Assignment
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Assignment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Name</label>
                <input
                  type="text"
                  value={newEntry.assignmentName}
                  onChange={(e) => setNewEntry({...newEntry, assignmentName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  value={newEntry.course}
                  onChange={(e) => setNewEntry({...newEntry, course: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Course</option>
                  {mockCourses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    value={newEntry.marksObtained}
                    onChange={(e) => setNewEntry({...newEntry, marksObtained: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={newEntry.totalMarks}
                    onChange={(e) => setNewEntry({...newEntry, totalMarks: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddEntry}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                Add Assignment
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
        </div>
        
        {filteredEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{entry.assignmentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === entry.id ? (
                        <input
                          type="number"
                          defaultValue={entry.marksObtained}
                          onBlur={(e) => handleUpdateEntry(entry.id, parseInt(e.target.value))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateEntry(entry.id, parseInt(e.currentTarget.value));
                            }
                          }}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{entry.marksObtained}/{entry.totalMarks}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        (entry.marksObtained / entry.totalMarks) * 100 >= 80 ? 'text-green-600' :
                        (entry.marksObtained / entry.totalMarks) * 100 >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {Math.round((entry.marksObtained / entry.totalMarks) * 100)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {entry.dateAdded.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingId(entry.id)}
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No assignments found for this course</p>
          </div>
        )}
      </div>
    </div>
  );
};