import React from 'react';
import { CourseCard } from './CourseCard';
import { Course } from '../types';

interface CourseListProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  isLoggedIn: boolean;
}

export const CourseList: React.FC<CourseListProps> = ({ courses, onSelectCourse, isLoggedIn }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onClick={onSelectCourse}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
};