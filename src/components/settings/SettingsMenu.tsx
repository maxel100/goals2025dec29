import React, { useState } from 'react';
import { LogOut, Trash2, Mail, AlertTriangle, Loader2, ListChecks } from 'lucide-react';
import { signOut } from '../../lib/auth';
import { deleteAccount } from '../../lib/delete';
import { EmailPreferences } from './EmailPreferences';
import { PrioritiesSettings } from './PrioritiesSettings';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

interface SettingsMenuProps {
  onClose: () => void;
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'email' | 'priorities' | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteAccount();
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account. Please try again or contact support.');
      }
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm border-b border-red-100">
          {error}
        </div>
      )}

      {showDeleteConfirm ? (
        <div className="p-4">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-medium">Delete Account</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure? This action cannot be undone and will permanently delete your account and all data.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setError(null);
              }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Yes, Delete Account
                </>
              )}
            </button>
          </div>
        </div>
      ) : activeSection === 'email' ? (
        <>
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Mail className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-medium">Email Preferences</h3>
          </div>
          <EmailPreferences />
          <div className="p-4 border-t">
            <button
              onClick={() => setActiveSection(null)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Back to Settings
            </button>
          </div>
        </>
      ) : activeSection === 'priorities' ? (
        <>
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ListChecks className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-medium">Priorities Settings</h3>
          </div>
          <PrioritiesSettings />
          <div className="p-4 border-t">
            <button
              onClick={() => setActiveSection(null)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Back to Settings
            </button>
          </div>
        </>
      ) : (
        <div className="py-2">
          <button
            onClick={() => setActiveSection('priorities')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
          >
            <ListChecks className="w-4 h-4" />
            Priorities Settings
          </button>

          <button
            onClick={() => setActiveSection('email')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
          >
            <Mail className="w-4 h-4" />
            Email Preferences
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
}