export interface Suggestion {
  title: string;
  description: string;
  emoji: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface SuggestionResult {
  suggestions: Suggestion[];
  sources: GroundingSource[];
}

export interface Location {
  latitude: number;
  longitude: number;
}