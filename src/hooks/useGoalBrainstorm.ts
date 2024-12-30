import { useState } from 'react';

export function useGoalBrainstorm(data: any, onNext: (data: any) => void) {
  const [activeCategory, setActiveCategory] = useState('health');
  const [goals, setGoals] = useState<Record<string, string[]>>(
    data.goals || {}
  );
  const [newGoal, setNewGoal] = useState('');
  const [scores, setScores] = useState<Record<string, { believability: number; excitement: number }>>({});

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    
    setGoals(prev => ({
      ...prev,
      [activeCategory]: [...(prev[activeCategory] || []), newGoal.trim()]
    }));
    setNewGoal('');
  };

  const handleRemoveGoal = (category: string, index: number) => {
    setGoals(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
    
    const goalText = goals[category][index];
    if (goalText && scores[goalText]) {
      const newScores = { ...scores };
      delete newScores[goalText];
      setScores(newScores);
    }
  };

  const handleCategoryClick = (categoryId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveCategory(categoryId);
  };

  const handleScoreChange = (goal: string, type: 'believability' | 'excitement', value: number) => {
    setScores(prev => ({
      ...prev,
      [goal]: { ...prev[goal], [type]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredGoals = Object.fromEntries(
      Object.entries(goals).map(([category, categoryGoals]) => [
        category,
        categoryGoals.filter(goal => {
          const score = scores[goal];
          return !score || (score.believability >= 7 && score.excitement >= 7);
        })
      ])
    );

    onNext({ goals: filteredGoals });
  };

  return {
    activeCategory,
    goals,
    newGoal,
    scores,
    handleAddGoal,
    handleRemoveGoal,
    handleCategoryClick,
    setNewGoal,
    handleSubmit,
    handleScoreChange
  };
}