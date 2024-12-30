import { 
  Brain, Heart, Briefcase, Users, Target, 
  Palmtree, Zap, Shield, Coins,
  Heart as EmotionHeart, Sparkles, Users2
} from 'lucide-react';

export const categories = {
  health: {
    title: 'Health & Fitness',
    icon: Heart,
    description: 'Physical wellbeing and fitness goals'
  },
  mind: {
    title: 'Mind & Beliefs',
    icon: Brain,
    description: 'Knowledge expansion and personal growth'
  },
  emotions: {
    title: 'Emotions',
    icon: EmotionHeart,
    description: 'Emotional wellbeing and balance'
  },
  relationships: {
    title: 'Relationships',
    icon: Users,
    description: 'Building meaningful connections'
  },
  mission: {
    title: 'Mission & Purpose',
    icon: Target,
    description: 'Life purpose and impact goals'
  },
  money: {
    title: 'Money & Finances',
    icon: Coins,
    description: 'Financial growth and wealth building'
  },
  family: {
    title: 'Family & Friends',
    icon: Users2,
    description: 'Nurturing important relationships'
  },
  lifestyle: {
    title: 'Fun & Lifestyle',
    icon: Palmtree,
    description: 'Adventures and experiences'
  },
  contribution: {
    title: 'Contribution',
    icon: Sparkles,
    description: 'Making a positive impact'
  },
  spirituality: {
    title: 'Spirituality',
    icon: Zap,
    description: 'Inner growth and connection'
  }
} as const;

export type CategoryKey = keyof typeof categories;