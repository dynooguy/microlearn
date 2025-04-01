import { useEffect, useState } from 'react';
import { getLearningPaths, type LearningPath } from '../services/learningPaths';

export function useLearningPaths() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadPaths() {
      try {
        const data = await getLearningPaths();
        setPaths(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load learning paths'));
      } finally {
        setLoading(false);
      }
    }

    loadPaths();
  }, []);

  return { paths, loading, error };
}