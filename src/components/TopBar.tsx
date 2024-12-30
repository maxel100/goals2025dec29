import React, { useState } from 'react';
import { Settings, LogOut, Users } from 'lucide-react';
import { signOut } from '../lib/auth';
import { SettingsMenu } from './settings/SettingsMenu';
import { NotificationBell } from './notifications/NotificationBell';
import { FriendsGoalsSection } from './social/FriendsGoalsSection';
import { YearNameEditor } from './YearNameEditor';

export function TopBar() {
  const [showSettings, setShowSettings] = useState(false);
  const [showFriendsGoals, setShowFriendsGoals] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent italic">
            <YearNameEditor />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFriendsGoals(true)}
              className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="hidden sm:inline">Friends Goals</span>
            </button>
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-2"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSettings && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSettings(false)} />
          <div className="absolute right-4 top-16">
            <SettingsMenu onClose={() => setShowSettings(false)} />
          </div>
        </div>
      )}

      {showFriendsGoals && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFriendsGoals(false)} />
          <div className="absolute right-4 top-16 w-[600px] bg-white rounded-xl shadow-xl p-6">
            <FriendsGoalsSection onClose={() => setShowFriendsGoals(false)} />
          </div>
        </div>
      )}
    </div>
  );
}