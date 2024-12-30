import React from 'react';
import { useLifeMission } from '../../../hooks/useLifeMission';
import { TextArea } from '../../../components/ui/TextArea';

export function LifeMissionStep() {
  const { mission, saveMission } = useLifeMission();
  const [formData, setFormData] = React.useState({
    vision: mission?.vision || '',
    importance: mission?.importance || ''
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    saveMission({
      ...formData,
      [field]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Your life mission serves as the foundation for all your goals. Take a moment to envision
        your ideal future and understand why it matters to you.
      </p>

      <div className="space-y-6">
        <TextArea
          label="Your 10, 20 or 30 year vision"
          placeholder="Describe what you really want long-term..."
          value={formData.vision}
          onChange={handleChange('vision')}
          minRows={6}
        />

        <TextArea
          label="Why is this important to you?"
          placeholder="Explain why achieving this vision matters..."
          value={formData.importance}
          onChange={handleChange('importance')}
          minRows={6}
        />
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Pro tip:</strong> Your life mission will help train your AI coach to provide
          more relevant insights and motivation throughout your journey.
        </p>
      </div>
    </div>
  );
}