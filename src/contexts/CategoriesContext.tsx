import React, { createContext, useContext, useState } from 'react';
import { AppCard, Category } from '../types';

interface CategoriesContextType {
  categories: Category[];
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  addCardToCategory: (cardId: string, categoryId: string) => void;
  removeCardFromCategory: (cardId: string, categoryId: string) => void;
  moveCardToCategory: (cardId: string, fromCategoryId: string, toCategoryId: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'default',
      name: 'Uncategorized',
      cards: [],
    },
  ]);

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      cards: [],
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (id: string) => {
    if (id === 'default') return; // Prevent removing default category
    const categoryToRemove = categories.find(cat => cat.id === id);
    if (!categoryToRemove) return;

    // Move cards to default category
    const defaultCategory = categories.find(cat => cat.id === 'default');
    if (defaultCategory) {
      defaultCategory.cards.push(...categoryToRemove.cards);
    }

    setCategories(categories.filter(cat => cat.id !== id));
  };

  const addCardToCategory = (cardId: string, categoryId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          cards: [...category.cards, cardId],
        };
      }
      return category;
    }));
  };

  const removeCardFromCategory = (cardId: string, categoryId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          cards: category.cards.filter(id => id !== cardId),
        };
      }
      return category;
    }));
  };

  const moveCardToCategory = (cardId: string, fromCategoryId: string, toCategoryId: string) => {
    removeCardFromCategory(cardId, fromCategoryId);
    addCardToCategory(cardId, toCategoryId);
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addCategory,
        removeCategory,
        addCardToCategory,
        removeCardFromCategory,
        moveCardToCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}; 