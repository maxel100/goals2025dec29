import React, { useState, useEffect } from 'react';
import { useReflection } from '../../hooks/useReflection';
import { Save, CheckCircle } from 'lucide-react';

export function YearlyDebrief() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const { debrief, saveDebrief, isLoading } = useReflection();
  const [formData, setFormData] = useState({
    wins: '',
    challenges: '',
    lessons: ''
  });

  useEffect(() => {
    if (debrief) {
      setFormData({
        wins: debrief.wins || '',
        challenges: debrief.challenges || '',
        lessons: debrief.lessons || ''
      });
    }
  }, [debrief]);

  const handleSave = async () => {
    try {
      await saveDebrief(formData);
      setIsEditing(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving debrief:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Debrief on Previous Year
      </h3>
      <p className="text-gray-600 mb-6">
        Build awareness by reflecting on your past year's journey.
      </p>

      {isEditing ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What were all the wins/successes/moments you had for the past year?
            </label>
            <textarea
              value={formData.wins}
              onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
              rows={4}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="List your achievements and memorable moments..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What were the challenges/struggles/failures?
            </label>
            <textarea
              value={formData.challenges}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
              rows={4}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe the obstacles you faced..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What did you learn from those challenges?
            </label>
            <textarea
              value={formData.lessons}
              onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
              rows={4}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Share your insights and learnings..."
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
              Save Reflection
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {showSaveSuccess && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg mb-4">
              <CheckCircle size={20} />
              <span>Reflection saved successfully!</span>
            </div>
          )}
          
          {debrief?.wins || debrief?.challenges || debrief?.lessons ? (
            <>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Wins & Successes</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{debrief.wins}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Challenges & Struggles</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{debrief.challenges}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Lessons Learned</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{debrief.lessons}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">No reflection added yet</p>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="text-primary-600 hover:text-primary-700"
          >
            {debrief?.wins ? 'Edit Reflection' : 'Add Reflection'}
          </button>
        </div>
      )}
    </div>
  );
}