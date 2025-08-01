import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CategorySelector from './components/CategorySelector';
import SuggestionCard from './components/SuggestionCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import Footer from './components/Footer';
import MoodSelector from './components/MoodSelector';
import TopicInput from './components/TopicInput';
import GroundingSources from './components/GroundingSources';
import { getSuggestions } from './services/geminiService';
import type { Suggestion, GroundingSource, Location } from './types';
import { CATEGORIES, MOODS } from './constants';

const App: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [selectedMood, setSelectedMood] = useState<string>(MOODS[0].name);
  const [topic, setTopic] = useState<string>('');

  const getCurrentLocation = (): Promise<Location | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser.");
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn(`Geolocation error (${error.code}): ${error.message}`);
          // Proceed without location if user denies or an error occurs.
          resolve(null);
        }
      );
    });
  };

  const fetchSuggestions = useCallback(async (category: string, mood: string, currentTopic: string, location: Location | null) => {
    setIsLoading(true);
    setError(null);
    setSources([]);
    try {
      const { suggestions: newSuggestions, sources: newSources } = await getSuggestions(category, mood, currentTopic, location);
      setSuggestions(newSuggestions);
      setSources(newSources);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生未知错误。');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialFetch = async () => {
        const location = await getCurrentLocation();
        fetchSuggestions(CATEGORIES[0], MOODS[0].name, '', location);
    };
    initialFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on initial load

  const handleInspireMeClick = async () => {
    const location = await getCurrentLocation();
    fetchSuggestions(selectedCategory, selectedMood, topic, location);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-200">
      <main className="flex-grow container mx-auto px-4">
        <Header />
        
        <div className="max-w-4xl mx-auto bg-slate-100/50 dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-center text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">第一步: 你现在感觉怎么样？</label>
                <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
              </div>
              <div>
                <label className="block text-center text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">第二步: 选择一个你感兴趣的类别</label>
                <CategorySelector 
                  selectedCategory={selectedCategory} 
                  onSelectCategory={setSelectedCategory} 
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="block text-center text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">第三步: 有没有特定的想法？ (可选)</label>
                <TopicInput topic={topic} setTopic={setTopic} disabled={isLoading} />
              </div>
          </div>
        </div>
        
        <div className="text-center my-8 md:my-10">
            <button
                onClick={handleInspireMeClick}
                disabled={isLoading}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isLoading ? '获取灵感中...' : '✨ 给我灵感！'}
            </button>
        </div>

        <div>
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorDisplay message={error} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {suggestions.map((suggestion, index) => (
                  <SuggestionCard key={index} suggestion={suggestion} />
                ))}
              </div>
              <GroundingSources sources={sources} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;