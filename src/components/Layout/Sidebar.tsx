import React from 'react';
import { Settings, User } from 'lucide-react';

interface SidebarProps {
  onPageChange: (page: string) => void;
  currentPage: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onPageChange, currentPage }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-16 hover:w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col z-30 transition-all duration-300 ease-in-out group">
      {/* Spacer to push bottom items down */}
      <div className="flex-1"></div>

      {/* Bottom Section - Settings and Admin */}
      <div className="p-4 space-y-2">
        <button
          onClick={() => onPageChange('settings')}
          className={`
            w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
            ${currentPage === 'settings' 
              ? 'bg-blue-50 text-blue-600 shadow-sm' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
            }
          `}
        >
          <Settings size={20} className="flex-shrink-0" />
          <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Settings
          </span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-medium">AJ</span>
          </div>
          <div className="ml-3 flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
            <p className="text-xs text-gray-500">ST2024001</p>
          </div>
        </div>
      </div>
    </div>
  );
};