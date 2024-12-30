import React from 'react';
import { StepProps } from '../types';
import { StepContainer } from '../ui/StepContainer';
import { TextArea } from '../ui/TextArea';

export function YearlyDebrief({ data, onNext, isFirst }: StepProps) {
  const [formData, setFormData] = React.useState({
    wins: data.debrief?.wins || '',
    challenges: data.debrief?.challenges || '',
    lessons: data.debrief?.lessons || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ debrief: formData });
  };

  return (
    <StepContainer
      title="Reflect on Your Journey"
      subtitle="Let's start by looking back at your experiences"
      onSubmit={handleSubmit}
      isFirst={isFirst}
    >
      <div className="space-y-6">
        <TextArea
          label="What were your wins and successes?"
          placeholder="List your achievements and memorable moments..."
          value={formData.wins}
          onChange={(e) => setFormData(prev => ({ ...prev, wins: e.target.value }))}
          minRows={4}
        />

        <TextArea
          label="What challenges did you face?"
          placeholder="Describe the obstacles and difficulties..."
          value={formData.challenges}
          onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
          minRows={4}
        />

        <TextArea
          label="What did you learn from those challenges?"
          placeholder="Share your insights and learnings..."
          value={formData.lessons}
          onChange={(e) => setFormData(prev => ({ ...prev, lessons: e.target.value }))}
          minRows={4}
        />
      </div>
    </StepContainer>
  );
}