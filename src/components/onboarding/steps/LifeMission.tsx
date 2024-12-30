import React from 'react';
import { StepProps } from '../types';
import { StepContainer } from '../ui/StepContainer';
import { TextArea } from '../ui/TextArea';

export function LifeMission({ data, onNext, onBack }: StepProps) {
  const [formData, setFormData] = React.useState({
    vision: data.mission?.vision || '',
    importance: data.mission?.importance || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ mission: formData });
  };

  return (
    <StepContainer
      title="Define Your Vision"
      subtitle="What's your long-term vision for your life?"
      onSubmit={handleSubmit}
      onBack={onBack}
    >
      <div className="space-y-6">
        <TextArea
          label="Your 10, 20 or 30 year vision"
          placeholder="Describe what you really want long-term..."
          value={formData.vision}
          onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
          minRows={6}
        />

        <TextArea
          label="Why is this important to you?"
          placeholder="Explain why this vision matters..."
          value={formData.importance}
          onChange={(e) => setFormData(prev => ({ ...prev, importance: e.target.value }))}
          minRows={6}
        />
      </div>
    </StepContainer>
  );
}