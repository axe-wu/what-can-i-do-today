import React from 'react';

interface TopicInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  disabled: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ topic, setTopic, disabled }) => {
  return (
    <div className="w-full max-w-sm">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="输入一个可选主题 (例如：学习新技能)"
        disabled={disabled}
        className="w-full px-4 py-2 text-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-200 disabled:opacity-50"
        aria-label="Optional topic input"
      />
    </div>
  );
};

export default TopicInput;
