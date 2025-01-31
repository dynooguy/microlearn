import React from 'react';
import { CourseCard } from './CourseCard';
import type { Course } from '../types/seatable';

interface CourseGridProps {
  courses: Course[];
  isLoading: boolean;
  error: Error | null;
}

export function CourseGrid({ courses, isLoading, error }: CourseGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading courses: {error.message}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course['Kurs-ID']} course={course} />
      ))}
    </div>
  );
}