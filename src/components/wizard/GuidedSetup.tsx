import React, { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, X, PartyPopper, ChevronDown, ChevronUp, ToggleLeft, SlidersHorizontal, CheckSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';
import { useGoalStore } from '../../store/goalStore';

interface GuidedSetupProps {
  onComplete: () => void;
}

type Step = {
  id: 'reflection' | 'mission' | 'goal1-category' | 'goal1-details' | 'goal2-category' | 'goal2-details' | 'celebration';
  title: string;
  description: string;
  sections?: {
    id: string;
    title: string;
    question: string;
    placeholder: string;
    helpText?: string;
    examples?: string[];
    type?: 'text' | 'rating' | 'tracking';
  }[];
};

type Category = {
  id: string;
  title: string;
  description: string;
};

const CATEGORIES: Category[] = [
  {
    id: 'health',
    title: 'Health & Fitness',
    description: 'Physical wellbeing and fitness goals'
  },
  {
    id: 'mind',
    title: 'Mind & Beliefs',
    description: 'Knowledge expansion and personal growth'
  },
  {
    id: 'emotions',
    title: 'Emotions',
    description: 'Emotional wellbeing and balance'
  },
  {
    id: 'relationships',
    title: 'Relationships',
    description: 'Building meaningful connections'
  },
  {
    id: 'mission',
    title: 'Mission & Purpose',
    description: 'Life purpose and impact goals'
  },
  {
    id: 'money',
    title: 'Money & Finances',
    description: 'Financial growth and wealth building'
  },
  {
    id: 'family',
    title: 'Family & Friends',
    description: 'Nurturing important relationships'
  },
  {
    id: 'lifestyle',
    title: 'Fun & Lifestyle',
    description: 'Adventures and experiences'
  },
  {
    id: 'contribution',
    title: 'Contribution',
    description: 'Making a positive impact'
  },
  {
    id: 'spirituality',
    title: 'Spirituality',
    description: 'Inner growth and connection'
  }
];

type TrackingType = 'simple';

const TRACKING_TYPES: { id: TrackingType; title: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'simple',
    title: 'On/Off Toggle',
    description: 'Simple yes/no tracking for habits and one-time achievements',
    icon: <ToggleLeft className="w-5 h-5" />
  }
];

const STEPS: Step[] = [
  {
    id: 'reflection',
    title: "Yearly Reflection",
    description: "Let's reflect on your journey so far and set the stage for your future success.",
    sections: [
      {
        id: 'wins',
        title: "Wins & Successes",
        question: "What are your biggest wins and successes from the past year?",
        placeholder: "Write about your achievements, no matter how small...",
        helpText: "Think about moments that made you proud or brought you joy.",
        examples: [
          "Got promoted at work",
          "Started a consistent workout routine"
        ]
      },
      {
        id: 'lessons',
        title: "Key Lessons",
        question: "What are the most important lessons you've learned?",
        placeholder: "Share what you've discovered about yourself...",
        helpText: "Consider what experiences have taught you and how you've grown.",
        examples: [
          "The importance of taking small steps consistently",
          "How setting boundaries improved my well-being"
        ]
      }
    ]
  },
  {
    id: 'mission',
    title: "Life Mission",
    description: "Define your long-term vision and why it matters to you.",
    sections: [
      {
        id: 'vision',
        title: "Your Vision",
        question: "What's your 10, 20, or 30-year vision for your life?",
        placeholder: "Describe the life you want to create...",
        helpText: "Think big - what would your ideal life look like if you could achieve anything?",
        examples: [
          "Building a successful business that helps others",
          "Creating a loving family and strong community"
        ]
      },
      {
        id: 'importance',
        title: "Why This Matters",
        question: "Why is this vision important to you? What drives you?",
        placeholder: "Share what motivates you deeply...",
        helpText: "Understanding your 'why' will help you stay committed when things get tough.",
        examples: [
          "To create a better future for my family",
          "To reach my full potential and grow"
        ]
      }
    ]
  },
  {
    id: 'goal1-category',
    title: "First Goal Category",
    description: "Choose an area of life for your first goal.",
  },
  {
    id: 'goal1-details',
    title: "First Goal Details",
    description: "Let's make this goal specific and achievable.",
    sections: [
      {
        id: 'goal1-text',
        title: "Your Goal",
        question: "What's your first goal?",
        placeholder: "Make it specific and actionable...",
        helpText: "Choose something meaningful that you can start working on right away.",
        examples: [
          "Exercise 3 times per week",
          "Read one book per month"
        ]
      },
      {
        id: 'goal1-believability',
        title: "",
        question: "How confident are you in achieving this goal? (1-10)",
        placeholder: "Rate from 1-10",
        helpText: "A score of 7+ means you believe you can realistically achieve this goal.",
        type: 'rating'
      },
      {
        id: 'goal1-excitement',
        title: "",
        question: "How excited are you about achieving this goal? (1-10)",
        placeholder: "Rate from 1-10",
        helpText: "A score of 7+ means you're genuinely motivated to work on this goal.",
        type: 'rating'
      }
    ]
  },
  {
    id: 'goal2-category',
    title: "Second Goal Category",
    description: "Choose an area of life for your second goal.",
  },
  {
    id: 'goal2-details',
    title: "Second Goal Details",
    description: "Let's make this goal specific and achievable.",
    sections: [
      {
        id: 'goal2-text',
        title: "Your Goal",
        question: "What's your second goal?",
        placeholder: "Make it specific and actionable...",
        helpText: "Choose something meaningful that you can start working on right away.",
        examples: [
          "Exercise 3 times per week",
          "Read one book per month"
        ]
      },
      {
        id: 'goal2-believability',
        title: "",
        question: "How confident are you in achieving this goal? (1-10)",
        placeholder: "Rate from 1-10",
        helpText: "A score of 7+ means you believe you can realistically achieve this goal.",
        type: 'rating'
      },
      {
        id: 'goal2-excitement',
        title: "",
        question: "How excited are you about achieving this goal? (1-10)",
        placeholder: "Rate from 1-10",
        helpText: "A score of 7+ means you're genuinely motivated to work on this goal.",
        type: 'rating'
      }
    ]
  },
  {
    id: 'celebration',
    title: "🎉 Congratulations!",
    description: "You've set your first two goals! You can now add as many goals as you'd like from your dashboard.",
  }
];

function RatingInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
        <button
          key={rating}
          onClick={() => onChange(rating)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            value >= rating
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          {rating}
        </button>
      ))}
    </div>
  );
}

function CategorySelector({ value, onChange, onSelect }: { 
  value: string; 
  onChange: (value: string) => void;
  onSelect: () => void;
}) {
  const handleCategorySelect = (categoryId: string) => {
    onChange(categoryId);
    // Automatically advance to next step after a short delay
    setTimeout(onSelect, 150); // Small delay for better UX
  };

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategorySelect(category.id)}
          className={`p-6 text-left border-2 rounded-xl transition-all transform hover:scale-105 ${
            value === category.id
              ? 'border-primary-500 bg-primary-50 shadow-lg'
              : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
          }`}
        >
          <h4 className="text-lg font-medium text-gray-900 mb-2">{category.title}</h4>
          <p className="text-sm text-gray-600">{category.description}</p>
        </button>
      ))}
    </div>
  );
}

function CelebrationView() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
        <PartyPopper className="w-12 h-12 text-primary-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Amazing Work! 🎉
      </h3>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        You've set your first two goals! You can now add as many goals as you'd like from your dashboard.
      </p>
      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 mb-8 max-w-md">
        <h4 className="font-medium text-gray-900 mb-2">What's Next?</h4>
        <ul className="text-left space-y-3 text-gray-600">
          <li>• Track your progress on your goals</li>
          <li>• Add more goals anytime</li>
          <li>• Connect with friends to share goals</li>
          <li>• Celebrate your achievements!</li>
        </ul>
      </div>
    </div>
  );
}

function Section({ 
  section, 
  value, 
  onChange,
  currentStep,
  responses,
  handleResponseChange 
}: { 
  section: Step['sections'][0]; 
  value: string | number; 
  onChange: (value: string | number) => void;
  currentStep: number;
  responses: any;
  handleResponseChange: (sectionId: string, value: string | number) => void;
}) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showRatingWarning, setShowRatingWarning] = useState(false);

  const handleRatingChange = (newValue: number) => {
    onChange(newValue);
    if (newValue < 7 && section.type === 'rating') {
      setShowRatingWarning(true);
    } else {
      setShowRatingWarning(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        {section.title}
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section.question}
        </label>
        
        <button
          onClick={() => setIsHelpOpen(!isHelpOpen)}
          className="mb-3 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          {isHelpOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Learn more about how to answer...
        </button>

        {isHelpOpen && (
          <div className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
            {section.helpText && (
              <p className="text-sm text-gray-600 mb-3">
                {section.helpText}
              </p>
            )}
            {section.examples && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Examples:</p>
                <div className="flex flex-wrap gap-2">
                  {section.examples.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => onChange(example)}
                      className="px-3 py-1.5 text-sm bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {section.type === 'rating' ? (
          <div className="space-y-3">
            <RatingInput
              value={value as number}
              onChange={handleRatingChange}
            />
            {showRatingWarning && (
              <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
                We recommend only setting goals that are at least a 7/10 in both believability and excitement. This ensures you're choosing goals you're confident about and motivated to achieve.
              </div>
            )}
          </div>
        ) : (
          <textarea
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={section.placeholder}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          />
        )}
      </div>
    </div>
  );
}

export function GuidedSetup({ onComplete }: GuidedSetupProps) {
  const initializeGoals = useGoalStore(state => state.initialize);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({
    reflection: {
      wins: '',
      lessons: ''
    },
    mission: {
      vision: '',
      importance: ''
    },
    goals: {
      goal1: {
        category: '',
        text: '',
        believability: 0,
        excitement: 0
      },
      goal2: {
        category: '',
        text: '',
        believability: 0,
        excitement: 0
      }
    }
  });

  const createGoal = async (goalData: typeof responses.goals.goal1) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('No user found');
    }

    console.log('Creating goal:', goalData);

    const goal = {
      title: goalData.text,
      category: goalData.category,
      type: 'simple',
      completed: false,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      hidden: false,
      items: null,
      monthly_progress: null,
      progress: null,
      target: null,
      unit: null
    };

    console.log('Saving goal with data:', goal);

    const { data, error } = await supabase
      .from('goals')
      .insert([goal])
      .select();

    if (error) {
      console.error('Error saving goal:', error);
      throw error;
    }

    console.log('Successfully saved goal:', data);
    return data;
  };

  const handleNext = async () => {
    if (currentStep === STEPS.length - 1) {
      try {
        console.log('Starting setup completion process...');
        const user = await getCurrentUser();
        if (!user) {
          console.error('No user found');
          throw new Error('No user found');
        }
        console.log('Current user:', user.id);

        // Save yearly reflection
        console.log('Saving yearly reflection...');
        const { data: existingDebrief, error: debriefCheckError } = await supabase
          .from('yearly_debrief')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (debriefCheckError && debriefCheckError.code !== 'PGRST116') {
          console.error('Error checking existing debrief:', debriefCheckError);
          throw debriefCheckError;
        }

        const { error: reflectionError } = await supabase
          .from('yearly_debrief')
          .upsert({
            id: existingDebrief?.id,
            user_id: user.id,
            wins: responses.reflection.wins,
            lessons: responses.reflection.lessons,
            updated_at: new Date().toISOString(),
            created_at: existingDebrief ? undefined : new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (reflectionError) {
          console.error('Error saving reflection:', reflectionError);
          throw reflectionError;
        }
        console.log('Successfully saved yearly reflection');

        // Save life mission
        console.log('Saving life mission...');
        const { data: existingMission, error: missionCheckError } = await supabase
          .from('life_mission')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (missionCheckError && missionCheckError.code !== 'PGRST116') {
          console.error('Error checking existing mission:', missionCheckError);
          throw missionCheckError;
        }

        const { error: missionError } = await supabase
          .from('life_mission')
          .upsert({
            id: existingMission?.id,
            user_id: user.id,
            vision: responses.mission.vision,
            importance: responses.mission.importance,
            updated_at: new Date().toISOString(),
            created_at: existingMission ? undefined : new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (missionError) {
          console.error('Error saving mission:', missionError);
          throw missionError;
        }
        console.log('Successfully saved life mission');

        // Save goals one by one
        console.log('Saving first goal...');
        await createGoal(responses.goals.goal1);
        
        console.log('Saving second goal...');
        await createGoal(responses.goals.goal2);

        // Mark wizard as completed
        console.log('Marking wizard as completed...');
        const { error: wizardError } = await supabase
          .from('wizard_completion')
          .upsert({
            user_id: user.id,
            completed: true,
            completed_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (wizardError) {
          console.error('Error updating wizard completion:', wizardError);
          // Try alternative approach if first attempt fails
          const { error: fallbackError } = await supabase
            .from('wizard_completion')
            .insert({
              user_id: user.id,
              completed: true,
              completed_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            });
            
          if (fallbackError) {
            console.error('Error with fallback wizard completion:', fallbackError);
            throw fallbackError;
          }
        }
        console.log('Successfully marked wizard as completed');

        // Re-initialize the goals store to load the new goals
        console.log('Re-initializing goals store...');
        await initializeGoals();
        console.log('Successfully re-initialized goals store');
        
        console.log('Setup completion process finished successfully');
        onComplete();
      } catch (err) {
        console.error('Error in setup completion process:', err);
        // Show detailed error to user
        alert(`There was an error completing the setup: ${(err as Error).message || 'Unknown error'}. Please try again or contact support if the issue persists.`);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onComplete();
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleResponseChange = (sectionId: string, value: string | number) => {
    const step = STEPS[currentStep];
    
    if (step.id === 'goal1-category') {
      setResponses(prev => ({
        ...prev,
        goals: {
          ...prev.goals,
          goal1: {
            ...prev.goals.goal1,
            category: value as string
          }
        }
      }));
    } else if (step.id === 'goal2-category') {
      setResponses(prev => ({
        ...prev,
        goals: {
          ...prev.goals,
          goal2: {
            ...prev.goals.goal2,
            category: value as string
          }
        }
      }));
    } else if (step.id.startsWith('goal')) {
      const [goalNum, field] = sectionId.split('-');
      setResponses(prev => ({
        ...prev,
        goals: {
          ...prev.goals,
          [goalNum]: {
            ...prev.goals[goalNum],
            [field]: value
          }
        }
      }));
    } else {
      setResponses(prev => ({
        ...prev,
        [step.id]: {
          ...prev[step.id],
          [sectionId]: value
        }
      }));
    }
  };

  const isStepValid = () => {
    const step = STEPS[currentStep];
    if (step.id === 'reflection') {
      return responses.reflection.wins.trim() && responses.reflection.lessons.trim();
    }
    if (step.id === 'mission') {
      return responses.mission.vision.trim() && responses.mission.importance.trim();
    }
    if (step.id === 'goal1-category') {
      return responses.goals.goal1.category !== '';
    }
    if (step.id === 'goal1-details') {
      return responses.goals.goal1.text.trim() &&
             responses.goals.goal1.believability > 0 &&
             responses.goals.goal1.excitement > 0;
    }
    if (step.id === 'goal2-category') {
      return responses.goals.goal2.category !== '';
    }
    if (step.id === 'goal2-details') {
      return responses.goals.goal2.text.trim() &&
             responses.goals.goal2.believability > 0 &&
             responses.goals.goal2.excitement > 0;
    }
    if (step.id === 'celebration') {
      return true;
    }
    return false;
  };

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onComplete}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
        </div>
        <p className="text-gray-600">{step.description}</p>
        
        {/* Progress bar */}
        <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Step {currentStep + 1} of {STEPS.length}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {step.id === 'celebration' ? (
          <CelebrationView />
        ) : step.id === 'goal1-category' || step.id === 'goal2-category' ? (
          <CategorySelector
            value={step.id === 'goal1-category' ? responses.goals.goal1.category : responses.goals.goal2.category}
            onChange={(value) => handleResponseChange(step.id, value)}
            onSelect={handleNext}
          />
        ) : (
          <div className="space-y-8">
            {step.sections?.map((section) => (
              <Section
                key={section.id}
                section={section}
                value={
                  step.id.startsWith('goal')
                    ? responses.goals[step.id.startsWith('goal1') ? 'goal1' : 'goal2'][section.id.split('-')[1]]
                    : responses[step.id][section.id]
                }
                onChange={(value) => handleResponseChange(section.id, value)}
                currentStep={currentStep}
                responses={responses}
                handleResponseChange={handleResponseChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`px-6 py-2 text-sm rounded-lg flex items-center gap-2 transition-all ${
              isStepValid()
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === STEPS.length - 1 ? 'Complete Setup' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 