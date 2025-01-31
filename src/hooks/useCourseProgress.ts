import { useEffect, useState } from 'react';
import { getLessonProgress } from '../services/progress';

export function useCourseProgress(courseId: string) {
  const [completedLessons, setCompletedLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const progress = await getLessonProgress(courseId);
        setCompletedLessons(progress.length);
      } catch (error) {
        console.error('Error loading course progress:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [courseId]);

  return { completedLessons, loading };
}