import { Course } from '../types';
import { courses } from '../data/courses';

export async function fetchCourses(): Promise<Course[]> {
  // Return static course data since we're not using SeaTable anymore
  return courses;
}