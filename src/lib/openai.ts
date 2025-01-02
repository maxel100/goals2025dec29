import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is not configured');
}

export const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
}); 