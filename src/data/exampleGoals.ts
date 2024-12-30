import { Goal } from '../types';
import { generateId } from '../utils/calculations';

export const exampleGoals: Record<string, Goal[]> = {
  health: [
    {
      id: generateId(),
      title: 'Follow workout program',
      category: 'health',
      type: 'monthly',
      monthlyProgress: {},
    },
    {
      id: generateId(),
      title: 'Complete 30-day sugar detox',
      category: 'health',
      type: 'simple',
      completed: false,
    },
    {
      id: generateId(),
      title: 'Reach target weight of 85kg',
      category: 'health',
      type: 'quantifiable',
      progress: 0,
      target: 85,
      unit: 'kg',
      trackingType: 'slider',
    },
    {
      id: generateId(),
      title: 'Weekly cryotherapy sessions',
      category: 'health',
      type: 'monthly',
      monthlyProgress: {},
    }
  ],
  mind: [
    {
      id: generateId(),
      title: '5 min daily affirmations',
      category: 'mind',
      type: 'monthly',
      monthlyProgress: {},
    },
    {
      id: generateId(),
      title: 'Read 24 books this year',
      category: 'mind',
      type: 'quantifiable',
      progress: 0,
      target: 24,
      unit: 'books',
      trackingType: 'subgoals',
      items: [],
    },
    {
      id: generateId(),
      title: 'Complete meditation course',
      category: 'mind',
      type: 'simple',
      completed: false,
    }
  ],
  emotions: [
    {
      id: generateId(),
      title: '30 day morning ritual challenge',
      category: 'emotions',
      type: 'simple',
      completed: false,
    },
    {
      id: generateId(),
      title: '30 days without complaining',
      category: 'emotions',
      type: 'simple',
      completed: false,
    },
    {
      id: generateId(),
      title: '10 days of meditation',
      category: 'emotions',
      type: 'quantifiable',
      progress: 0,
      target: 10,
      unit: 'days',
      trackingType: 'slider',
    }
  ],
  relationships: [
    {
      id: generateId(),
      title: 'Weekly date night',
      category: 'relationships',
      type: 'monthly',
      monthlyProgress: {},
    },
    {
      id: generateId(),
      title: 'Take massage classes',
      category: 'relationships',
      type: 'simple',
      completed: false,
    }
  ],
  mission: [
    {
      id: generateId(),
      title: 'Define 5-year vision',
      category: 'mission',
      type: 'simple',
      completed: false,
    },
    {
      id: generateId(),
      title: 'Create impact measurement system',
      category: 'mission',
      type: 'simple',
      completed: false,
    }
  ],
  money: [
    {
      id: generateId(),
      title: 'Invest $50,000',
      category: 'money',
      type: 'quantifiable',
      progress: 0,
      target: 50000,
      unit: 'dollars',
      trackingType: 'slider',
    },
    {
      id: generateId(),
      title: 'Generate $10k monthly passive income',
      category: 'money',
      type: 'quantifiable',
      progress: 0,
      target: 10000,
      unit: 'dollars',
      trackingType: 'slider',
    }
  ],
  family: [
    {
      id: generateId(),
      title: 'Weekly family calls',
      category: 'family',
      type: 'monthly',
      monthlyProgress: {},
    },
    {
      id: generateId(),
      title: 'Join entrepreneur meetup group',
      category: 'family',
      type: 'simple',
      completed: false,
    },
    {
      id: generateId(),
      title: 'Attend personal growth workshop',
      category: 'family',
      type: 'simple',
      completed: false,
    }
  ],
  lifestyle: [
    {
      id: generateId(),
      title: 'Plan snowboarding trip',
      category: 'lifestyle',
      type: 'simple',
      completed: false,
    },
    {
      id: generateId(),
      title: 'Take 4 weekend trips',
      category: 'lifestyle',
      type: 'quantifiable',
      progress: 0,
      target: 4,
      unit: 'trips',
      trackingType: 'subgoals',
      items: [],
    }
  ],
  contribution: [
    {
      id: generateId(),
      title: 'Volunteer 24 hours',
      category: 'contribution',
      type: 'quantifiable',
      progress: 0,
      target: 24,
      unit: 'hours',
      trackingType: 'slider',
    },
    {
      id: generateId(),
      title: 'Donate $5,000 to charity',
      category: 'contribution',
      type: 'quantifiable',
      progress: 0,
      target: 5000,
      unit: 'dollars',
      trackingType: 'slider',
    }
  ],
  spirituality: [
    {
      id: generateId(),
      title: 'Daily gratitude practice',
      category: 'spirituality',
      type: 'monthly',
      monthlyProgress: {},
    },
    {
      id: generateId(),
      title: 'Complete mindfulness retreat',
      category: 'spirituality',
      type: 'simple',
      completed: false,
    }
  ]
};