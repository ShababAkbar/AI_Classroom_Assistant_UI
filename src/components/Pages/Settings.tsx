import React, { useState } from 'react';
import { Mail, MessageCircle, Bell, User, Moon, Sun, TestTube } from 'lucide-react';
import { UserSettings } from '../../types';
import { useApi, useApiMutation } from '../../hooks/useApi';
import { settingsService } from '../../services/settingsService';
import { notificationService } from '../../services/notificationService';

export const Settings: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [localSettings, setLocalSettings] = useState<UserSettings | null>(null);

  // Fetch user settings from backend
  const { 
    data: settings, 
    loading, 
    error,
    refetch 
  } = useApi(() => settingsService.getUserSettings());

  // Mutations
  const { mutate: updateSettings, loading: saving } = useApiMutation<UserSettings, Partial<UserSettings>>();
  const { mutate: sendTestNotification, loading: testing } = useApiMutation<{ success: boolean; message: string }, 'email' | 'whatsapp' | 'both'>();

  // Use local settings if available, otherwise use fetched settings
  const currentSettings = localSettings || settings;

  const handleSave = async () => {
    if (!currentSettings) return;
    
    try {
      await updateSettings(
        (data) => settingsService.updateUserSettings(data),
        currentSettings
      );
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Refresh settings from backend
      await refetch();
      setLocalSettings(null); // Clear local changes
    } catch (error) {
      console.error('Error saving settings:', error);
      // You can add a toast notification here
    }
  };

  const handleTestNotification = async () => {
    if (!currentSettings) return;
    
    try {
      const result = await sendTestNotification(
        (channel) => notificationService.sendTestNotification(channel),
        currentSettings.notificationPreferences
      );
      
      alert(result.message || 'Test notification sent successfully!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Failed to send test notification. Please try again.');
    }
  };

  const updateLocalSettings = (updates: Partial<UserSettings>) => {
    if (!currentSettings) return;
    setLocalSettings({ ...currentSettings, ...updates });
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Settings</h3>
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

  if (!currentSettings) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">No settings found</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and notifications</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-800">Settings saved successfully!</p>
        </div>
      )}

      <div className="space-y-8">
        {/* User Profile */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={currentSettings.name}
                onChange={(e) => updateLocalSettings({ name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
              <input
                type="text"
                value={currentSettings.studentId}
                onChange={(e) => updateLocalSettings({ studentId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={currentSettings.email}
                onChange={(e) => updateLocalSettings({ email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Notification Channels</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="notifications"
                    value="email"
                    checked={currentSettings.notificationPreferences === 'email'}
                    onChange={(e) => updateLocalSettings({ notificationPreferences: e.target.value as any })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Email Only</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="notifications"
                    value="whatsapp"
                    checked={currentSettings.notificationPreferences === 'whatsapp'}
                    onChange={(e) => updateLocalSettings({ notificationPreferences: e.target.value as any })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">WhatsApp Only</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="notifications"
                    value="both"
                    checked={currentSettings.notificationPreferences === 'both'}
                    onChange={(e) => updateLocalSettings({ notificationPreferences: e.target.value as any })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <Bell className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-700">Both Email & WhatsApp</span>
                </label>
              </div>
            </div>
            
            <div>
              <button
                onClick={handleTestNotification}
                disabled={testing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200 disabled:opacity-50"
              >
                <TestTube className="w-5 h-5" />
                {testing ? 'Sending...' : 'Test Notification'}
              </button>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            {currentSettings.theme === 'dark' ? (
              <Moon className="w-6 h-6 text-blue-600" />
            ) : (
              <Sun className="w-6 h-6 text-blue-600" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">Theme Preference</h2>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={currentSettings.theme === 'light'}
                onChange={(e) => updateLocalSettings({ theme: e.target.value as any })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <Sun className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-gray-700">Light Mode</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={currentSettings.theme === 'dark'}
                onChange={(e) => updateLocalSettings({ theme: e.target.value as any })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <Moon className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">Dark Mode</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};