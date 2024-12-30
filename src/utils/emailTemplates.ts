import { Goal, WeeklyPriority } from '../types';

export function generateWeeklyReviewEmail(
  goals: Goal[],
  weeklyPriorities: WeeklyPriority,
  totalProgress: number
) {
  const formatProgress = (progress: number) => `${Math.round(progress)}%`;
  
  const formatGoalProgress = (goal: Goal) => {
    switch (goal.type) {
      case 'simple':
        return goal.completed ? '✅ Completed' : '⏳ In Progress';
      case 'quantifiable':
        return `${goal.progress}/${goal.target} ${goal.unit}`;
      case 'monthly':
        const completedMonths = Object.values(goal.monthlyProgress).filter(Boolean).length;
        return `${completedMonths}/12 months`;
      default:
        return '';
    }
  };

  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #738440; text-align: center;">Weekly Progress Review</h1>
          
          <div style="background: #f6f7f1; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin-top: 0;">Overall Progress: ${formatProgress(totalProgress)}</h2>
          </div>

          <div style="margin-bottom: 30px;">
            <h2>Weekly Priorities</h2>
            ${weeklyPriorities.priorities.map(p => `
              <div style="margin-bottom: 10px;">
                ${p.completed ? '✅' : '⭕️'} ${p.text}
              </div>
            `).join('')}
          </div>

          <div>
            <h2>Goals Progress</h2>
            ${Object.entries(
              goals.reduce((acc, goal) => ({
                ...acc,
                [goal.category]: [...(acc[goal.category] || []), goal]
              }), {} as Record<string, Goal[]>)
            ).map(([category, categoryGoals]) => `
              <div style="margin-bottom: 20px;">
                <h3 style="color: #738440;">${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                ${categoryGoals.map(goal => `
                  <div style="margin-bottom: 10px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
                    <strong>${goal.title}</strong><br>
                    <span style="color: #666;">${formatGoalProgress(goal)}</span>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      </body>
    </html>
  `;
}