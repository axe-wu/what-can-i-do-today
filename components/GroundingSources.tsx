import React from 'react';
import type { GroundingSource } from '../types';

interface GroundingSourcesProps {
  sources: GroundingSource[];
}

const GroundingSources: React.FC<GroundingSourcesProps> = ({ sources }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
      <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">
        灵感来源
      </h4>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {sources.map((source, index) => (
          <li key={index}>
            <a
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-sky-600 dark:text-sky-400 hover:underline"
              aria-label={`Read more about ${source.title}`}
            >
              {source.title || new URL(source.uri).hostname}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroundingSources;
