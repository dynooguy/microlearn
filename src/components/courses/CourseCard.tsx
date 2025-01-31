import React from 'react';
import { useAtom } from 'jotai';
import { Award, Clock, BookOpen } from 'lucide-react';
import type { Course } from '../../types/seatable';
import { useCourseProgress } from '../../hooks/useCourseProgress';
import { themeAtom, getThemeClass } from '../../lib/theme';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [theme] = useAtom(themeAtom);
  const totalLessons = course.Kapitel.reduce(
    (sum, chapter) => sum + chapter.Lektionen.length,
    0
  );
  
  const totalDuration = course.Kapitel.reduce(
    (sum, chapter) => 
      sum + chapter.Lektionen.reduce(
        (chapterSum, lesson) => chapterSum + lesson.azCf,
        0
      ),
    0
  );

  const { completedLessons, loading: progressLoading } = useCourseProgress(course['0000']);
  const progress = (completedLessons / totalLessons) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={course.Ev4v[0]}
          alt={course.LVxv}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            course.Rfrz === '840548'
              ? 'bg-green-100 text-green-800'
              : course.Rfrz === '194107'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            <Award className="w-4 h-4 mr-1" />
            {course.Rfrz === '840548' ? 'Starter' : course.Rfrz === '194107' ? 'Fortgeschritten' : 'Experte'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{course.LVxv}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{course['6lhR']}</p>

        <div className="space-y-3">
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`${getThemeClass(theme.colors.primary)} h-full transition-all duration-300 ease-in-out`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {totalDuration} min
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {!progressLoading && (
              <span>
                {completedLessons} / {totalLessons} Lektionen
              </span>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}