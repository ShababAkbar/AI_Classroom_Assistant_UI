import React from 'react';
import { ArrowLeft, Download, FileText, Calendar, Clock, BookOpen } from 'lucide-react';
import { Assignment } from '../../types';
import { API_BASE_URL } from '../../config/api';

interface AssignmentViewerProps {
  assignment: Assignment | null;
  onBack: () => void;
}

export const AssignmentViewer: React.FC<AssignmentViewerProps> = ({ assignment, onBack }) => {
  if (!assignment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No assignment selected</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const isUrgent = daysUntilDue <= 1 && assignment.status === 'pending';

  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold text-gray-900 mb-4">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold text-gray-900 mb-3 mt-6">{line.substring(3)}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1 text-gray-700">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-2 text-gray-700">{line}</p>;
    });
  };

  const handleDownload = (downloadLink: string, filename: string) => {
    // Create full URL for download
    const fullUrl = downloadLink.startsWith('http') 
      ? downloadLink 
      : `${API_BASE_URL}/files${downloadLink}`;
    
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewAIResponse = (aiResponseFile: string) => {
    // Open AI response file in new tab
    const fullUrl = aiResponseFile.startsWith('http') 
      ? aiResponseFile 
      : `${API_BASE_URL}/files${aiResponseFile}`;
    
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Assignments
        </button>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-lg text-blue-600 font-medium">{assignment.course}</span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {formatDate(assignment.dueDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                    assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {assignment.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className={`px-4 py-2 rounded-xl text-center font-medium ${
                assignment.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : isUrgent 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {assignment.status === 'completed' ? 'Completed' : 
                 isUrgent ? 'Due Soon' : 'Pending'}
              </div>
              
              {daysUntilDue > 0 && assignment.status === 'pending' && (
                <div className="text-center text-sm text-gray-600">
                  {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''} remaining
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignment Description */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Assignment Description</h2>
            <div className="prose max-w-none">
              {renderMarkdown(assignment.description)}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {assignment.downloadLink && (
                <button 
                  onClick={() => handleDownload(assignment.downloadLink!, `${assignment.title}.pdf`)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              )}
              
              {assignment.aiResponseFile && (
                <button 
                  onClick={() => handleViewAIResponse(assignment.aiResponseFile!)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors duration-200"
                >
                  <FileText className="w-5 h-5" />
                  View AI Response
                </button>
              )}
            </div>
          </div>

          {/* Assignment Details */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Course</p>
                <p className="font-medium text-gray-900">{assignment.course}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Priority</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                  assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {assignment.priority.toUpperCase()}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  assignment.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {assignment.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};