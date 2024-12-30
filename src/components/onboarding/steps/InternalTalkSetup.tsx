import React, { useState } from 'react';
import { StepProps } from '../types';
import { StepContainer } from '../ui/StepContainer';
import { TextArea } from '../ui/TextArea';
import { Plus, X } from 'lucide-react';

export function InternalTalkSetup({ data, onNext, onBack }: StepProps) {
  const [internalTalk, setInternalTalk] = useState<string[]>(data.internalTalk || []);
  const [avoidance, setAvoidance] = useState<string[]>(data.avoidance || []);
  const [newTalk, setNewTalk] = useState('');
  const [newAvoidance, setNewAvoidance] = useState('');

  const handleAddTalk = () => {
    if (!newTalk.trim()) return;
    setInternalTalk(prev => [...prev, newTalk.trim()]);
    setNewTalk('');
  };

  const handleAddAvoidance = () => {
    if (!newAvoidance.trim()) return;
    setAvoidance(prev => [...prev, newAvoidance.trim()]);
    setNewAvoidance('');
  };

  const handleRemoveTalk = (index: number) => {
    setInternalTalk(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAvoidance = (index: number) => {
    setAvoidance(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ internalTalk, avoidance });
  };

  return (
    <StepContainer
      title="Shape Your Mindset"
      subtitle="Define your internal dialogue and identify patterns to avoid"
      onSubmit={handleSubmit}
      onBack={onBack}
    >
      <div className="space-y-8">
        {/* Internal Talk */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            What do you want your internal talk to be?
          </h3>
          <div className="space-y-2">
            <TextArea
              label="Add positive self-talk"
              value={newTalk}
              onChange={(e) => setNewTalk(e.target.value)}
              placeholder="e.g., I am capable of achieving my goals..."
              minRows={2}
            />
            <button
              type="button"
              onClick={handleAddTalk}
              className="flex items-center gap-2 text-landing-green hover:text-landing-green/80"
            >
              <Plus className="w-4 h-4" />
              Add Statement
            </button>
          </div>
          <div className="space-y-2">
            {internalTalk.map((talk, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <p className="flex-grow text-sm">{talk}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveTalk(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Avoidance */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            What patterns or behaviors do you want to avoid?
          </h3>
          <div className="space-y-2">
            <TextArea
              label="Add behavior to avoid"
              value={newAvoidance}
              onChange={(e) => setNewAvoidance(e.target.value)}
              placeholder="e.g., Procrastinating on important tasks..."
              minRows={2}
            />
            <button
              type="button"
              onClick={handleAddAvoidance}
              className="flex items-center gap-2 text-landing-green hover:text-landing-green/80"
            >
              <Plus className="w-4 h-4" />
              Add Pattern
            </button>
          </div>
          <div className="space-y-2">
            {avoidance.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <p className="flex-grow text-sm">{item}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveAvoidance(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StepContainer>
  );
}