import { Goal } from '../types';
import {
  Brain,
  Heart,
  Briefcase,
  Users,
  Target,
  Palmtree,
  Zap,
  Shield,
} from 'lucide-react';
import { generateUUID } from '../utils/uuid';

export const categories = {
  mind: {
    title: 'Mind & Belief',
    icon: Brain,
    description: 'Expanding knowledge and consciousness',
  },
  health: {
    title: 'Health',
    icon: Heart,
    description: 'Physical wellbeing and fitness',
  },
  business: {
    title: 'Business & Finances',
    icon: Briefcase,
    description: 'Career and financial growth',
  },
  relationship: {
    title: 'Relationship',
    icon: Users,
    description: 'Nurturing connections',
  },
  mission: {
    title: 'Mission/Purpose',
    icon: Target,
    description: 'Making an impact',
  },
  lifestyle: {
    title: 'Lifestyle',
    icon: Palmtree,
    description: 'Personal growth and experiences',
  },
  energy: {
    title: 'My Energy',
    icon: Zap,
    description: 'Personal presence and impact',
  },
  guardrails: {
    title: 'Guardrails',
    icon: Shield,
    description: 'Accountability and guidance',
  },
} as const;

export const goals: Goal[] = [
  // Mind & Belief
  {
    id: generateUUID(),
    title: 'Read 20+ books',
    category: 'mind',
    type: 'quantifiable',
    target: 20,
    progress: 0,
    unit: 'books',
    items: []
  },
  {
    id: generateUUID(),
    title: 'Speak conversational Swedish',
    category: 'mind',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Complete meditation retreat',
    category: 'mind',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Monthly shrms',
    category: 'mind',
    type: 'monthly',
    monthlyProgress: {}
  },
  {
    id: generateUUID(),
    title: 'Story telling at the moth',
    category: 'mind',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Complete one full minimalisation of stuff',
    category: 'mind',
    type: 'simple',
    completed: false
  },

  // Health
  {
    id: generateUUID(),
    title: 'Hold handstand for 30 seconds',
    category: 'health',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Invest 2 hrs per week on mobility',
    category: 'health',
    type: 'monthly',
    monthlyProgress: {}
  },
  {
    id: generateUUID(),
    title: 'Hire amazing mobility coach',
    category: 'health',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: '85kg 11% BF',
    category: 'health',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Complete functional patterns course',
    category: 'health',
    type: 'simple',
    completed: false
  },

  // Business & Finances
  {
    id: generateUUID(),
    title: 'Make $500k across all projects',
    category: 'business',
    type: 'quantifiable',
    target: 500000,
    progress: 0,
    unit: 'dollars',
    items: []
  },
  {
    id: generateUUID(),
    title: 'Get one new cash flow stream that generates $10k+/mo',
    category: 'business',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Launch one software company per quarter until PMF',
    category: 'business',
    type: 'quantifiable',
    target: 4,
    progress: 0,
    unit: 'companies',
    items: []
  },

  // Relationship
  {
    id: generateUUID(),
    title: 'Workshop',
    category: 'relationship',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Get shared hobby - massage, dancing?',
    category: 'relationship',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Connect with one hero',
    category: 'relationship',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Host 1 power couple retreat',
    category: 'relationship',
    type: 'simple',
    completed: false
  },

  // Mission/Purpose
  {
    id: generateUUID(),
    title: 'Volunteer 2 days',
    category: 'mission',
    type: 'quantifiable',
    target: 2,
    progress: 0,
    unit: 'days',
    items: []
  },
  {
    id: generateUUID(),
    title: 'Gift $10k to parents on something health related',
    category: 'mission',
    type: 'simple',
    completed: false
  },

  // Lifestyle
  {
    id: generateUUID(),
    title: 'Make an emotional film with AI',
    category: 'lifestyle',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Relearn Clair de lune and intro to Fantastie impromptu',
    category: 'lifestyle',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Do 1 "adventurous" activity',
    category: 'lifestyle',
    type: 'simple',
    completed: false
  },

  // My Energy
  {
    id: generateUUID(),
    title: 'Someone that lifts people up and inspires them',
    category: 'energy',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Lives with extreme integrity',
    category: 'energy',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Gratitude and appreciation',
    category: 'energy',
    type: 'simple',
    completed: false
  },
  {
    id: generateUUID(),
    title: 'Radiate passion, excitement & clarity for my vision',
    category: 'energy',
    type: 'simple',
    completed: false
  },

  // Guardrails
  {
    id: generateUUID(),
    title: 'Coach monthly',
    category: 'guardrails',
    type: 'monthly',
    monthlyProgress: {}
  },
  {
    id: generateUUID(),
    title: 'Coaching 1 person per month',
    category: 'guardrails',
    type: 'monthly',
    monthlyProgress: {}
  }
];