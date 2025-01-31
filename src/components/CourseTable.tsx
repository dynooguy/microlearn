import React from 'react';
import { Award, Clock } from 'lucide-react';
import type { Course } from '../types/seatable';

interface CourseTableProps {
  courses: Course[];
  isLoading: boolean;
  error: Error | null;
}

export function CourseTable({ courses, isLoading, error }: CourseTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
    <div className="space-y-12 bg-white rounded-lg shadow p-8">
      {courses.map((course) => (
        <div key={course['Kurs-ID']} className="space-y-6">
          <div key={`content-${course['Kurs-ID']}`} className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                className="h-16 w-16 rounded-lg object-cover shadow-sm"
                src={course.Kursbild}
                alt={course.Name}
              />
              <div key={`info-${course['Kurs-ID']}`}>
                <h1 className="text-2xl font-bold text-gray-900">
                  {course.Name}
                </h1>
                <div key={`level-${course['Kurs-ID']}`} className="flex items-center mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    course.Level === 'Starter'
                      ? 'bg-green-100 text-green-800'
                      : course.Level === 'Fortgeschritten'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    <Award className="w-3 h-3 mr-1" />
                    {course.Level}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 max-w-3xl">
              {course.Kurzbeschreibung}
            </p>
          </div>
          
          <div className="pl-6 space-y-6">
            {course.Kapitel.map((chapter) => (
              <div key={chapter['Kapitel-ID']} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {chapter.Nummer}. {chapter.Name}
                </h2>
                
                <div className="pl-6 space-y-3">
                  {chapter.Lektionen.map((lesson) => (
                    <div key={lesson.LektionID} className="group">
                      <h3 key={`lesson-${lesson.LektionID}`} className="text-lg text-gray-700 flex items-center gap-3">
                        <span>{chapter.Nummer}.{lesson.Nummer}</span>
                        {lesson.Name}
                        <span key={`duration-${lesson.LektionID}`} className="text-sm text-gray-500 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Clock className="w-4 h-4 mr-1" />
                          {lesson.DauerInMin} min
                        </span>
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}