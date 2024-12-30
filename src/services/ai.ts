import OpenAI from 'openai';
import { GoalInput } from '../types/goals';
import { categories } from '../data/categories';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateGoalsFromSurvey(surveyData: any): Promise<GoalInput[]> {
  try {
    // Only proceed with AI if user provided goals
    const hasUserGoals = Object.values(surveyData.goals).some(
      (goals: any) => Array.isArray(goals) && goals.length > 0
    );

    if (!hasUserGoals) {
      console.log('No user goals provided');
      return [];
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert goal-setting AI assistant. Your task is to convert user-provided goals into structured goal objects.
            Each goal should have:
            - title: Clear, actionable goal statement
            - category: One of [${Object.keys(categories).join(', ')}]
            - type: "simple" | "quantifiable" | "monthly"
            - target?: number (for quantifiable goals)
            - unit?: string (for quantifiable goals)
            
            For quantifiable goals:
            - Extract numeric targets when present (e.g. "Read 12 books" -> target: 12, unit: "books")
            - For financial goals, use dollars as unit
            - For recurring activities, use monthly type
            
            Keep titles concise but specific.
            Return ONLY valid goals that match the schema.`
        },
        {
          role: "user",
          content: `Convert these goals into structured format:
            Goals by category: ${JSON.stringify(surveyData.goals)}
            Life Mission: ${JSON.stringify(surveyData.mission)}
            
            Return ONLY a JSON array of goal objects.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      console.error('No response from AI');
      return [];
    }

    try {
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed.goals)) {
        // Validate and clean each goal
        return parsed.goals.map((goal: any) => ({
          title: goal.title,
          category: goal.category.toLowerCase(),
          type: goal.type,
          target: goal.target,
          unit: goal.unit
        }));
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }

    return [];
  } catch (error) {
    console.error('Error generating goals:', error);
    return [];
  }
}