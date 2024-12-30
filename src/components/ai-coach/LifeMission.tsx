import React, { useState, useEffect } from 'react';
import { useLifeMission } from '../../hooks/useLifeMission';
import { Save, CheckCircle, Loader2 } from 'lucide-react';

export function LifeMission() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const { mission, saveMission, isLoading } = useLifeMission();
  const [formData, setFormData] = useState({
    vision: '',
    importance: ''
  });

  useEffect(() => {
    if (mission) {
      setFormData({
        vision: mission.vision || '',
        importance: mission.importance || ''
      });
    }
  }, [mission]);

  const handleSave = async () => {
    try {
      await saveMission(formData);
      setIsEditing(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving life mission:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300">
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Connect with Your Life Mission
      </h3>
      <p className="text-gray-600 mb-6">
        Define your long-term vision and understand its deep importance to you.
      </p>

      {isEditing ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your 10, 20 or 30 year vision from now. What do you really want longterm?
            </label>
            <textarea
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              rows={6}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe your long-term vision in detail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why is this important to me?
            </label>
            <textarea
              value={formData.importance}
              onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
              rows={6}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Explain why this vision matters to you..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <Save size={20} />
              Save Mission
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {showSaveSuccess && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg mb-4">
              <CheckCircle size={20} />
              <span>Mission saved successfully!</span>
            </div>
          )}
          
          {mission?.vision || mission?.importance ? (
            <>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Long-term Vision</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{mission.vision}</p>
              </div>
              {mission.importance && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Why This Matters</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{mission.importance}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">No mission defined yet</p>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="text-primary-600 hover:text-primary-700"
          >
            {mission?.vision ? 'Edit Mission' : 'Define Mission'}
          </button>
        </div>
      )}
    </div>
  );
}