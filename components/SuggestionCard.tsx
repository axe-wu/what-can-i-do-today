import React from 'react';
import type { Suggestion } from '../types';

interface SuggestionCardProps {
  suggestion: Suggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-6 flex flex-col items-center text-center transform hover:-translate-y-1">
      <div className="text-6xl mb-4">{suggestion.emoji}</div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
        {suggestion.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        {suggestion.description}
      </p>
    </div>
  );
};

export default SuggestionCard;