import React from 'react';
import { MOODS } from '../constants';

interface MoodSelectorProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      {MOODS.map(({name, emoji}) => (
        <button
          key={name}
          onClick={() => onSelectMood(name)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-sky-500
            ${selectedMood === name
              ? 'bg-sky-500 text-white shadow-md scale-105'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-700'
            }`}
        >
          <span>{emoji}</span>
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
