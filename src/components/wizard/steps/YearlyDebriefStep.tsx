import React from 'react';
import { useReflection } from '../../../hooks/useReflection';
import { TextArea } from '../../../components/ui/TextArea';

export function YearlyDebriefStep() {
  const { debrief, saveDebrief } = useReflection();
  const [formData, setFormData] = React.useState({
    wins: debrief?.wins || '',
    challenges: debrief?.challenges || ''
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    saveDebrief({
      ...formData,
      [field]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Reflecting on your past experiences helps build awareness and set better goals for the future.
        Take a moment to consider your journey so far.
      </p>

      <div className="space-y-6">
        <TextArea
          label="What were your wins and successes?"
          placeholder="List your achievements and memorable moments..."
          value={formData.wins}
          onChange={handleChange('wins')}
          minRows={4}
        />

        <TextArea
          label="What challenges did you face?"
          placeholder="Describe the obstacles and difficulties..."
          value={formData.challenges}
          onChange={handleChange('challenges')}
          minRows={4}
        />
      </div>
    </div>
  );
}