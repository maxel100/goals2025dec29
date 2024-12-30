import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CategoryKey } from '../data/categories';

interface HiddenCategoriesStore {
  hiddenCategories: CategoryKey[];
  hideCategory: (category: CategoryKey) => void;
  showCategory: (category: CategoryKey) => void;
}

export const useHiddenCategories = create<HiddenCategoriesStore>()(
  persist(
    (set) => ({
      hiddenCategories: [],
      hideCategory: (category) =>
        set((state) => ({
          hiddenCategories: [...state.hiddenCategories, category],
        })),
      showCategory: (category) =>
        set((state) => ({
          hiddenCategories: state.hiddenCategories.filter((c) => c !== category),
        })),
    }),
    {
      name: 'hidden-categories',
    }
  )
);