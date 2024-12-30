import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WizardCompletionStore {
  isCompleted: boolean;
  markCompleted: () => void;
  reset: () => void;
}

export const useWizardCompletion = create<WizardCompletionStore>()(
  persist(
    (set) => ({
      isCompleted: false,
      markCompleted: () => set({ isCompleted: true }),
      reset: () => set({ isCompleted: false }),
    }),
    {
      name: 'wizard-completion',
    }
  )
);