import { supabase } from '../lib/supabase';

export interface CourseProgress {
  id: string;
  courseId: string;
  startedAt: Date;
  completedAt: Date | null;
  lastAccessedAt: Date;
}

export interface LessonProgress {
  id: string;
  courseId: string;
  lessonId: string;
  completedAt: Date;
  lastAccessedAt: Date;
}

export async function getCourseProgress(courseId: string): Promise<CourseProgress | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_course_progress')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching course progress:', error);
    return null;
  }

  return data ? {
    id: data.id,
    courseId: data.course_id,
    startedAt: new Date(data.started_at),
    completedAt: data.completed_at ? new Date(data.completed_at) : null,
    lastAccessedAt: new Date(data.last_accessed_at)
  } : null;
}

export async function getLessonProgress(courseId: string): Promise<LessonProgress[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_lesson_progress')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching lesson progress:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    courseId: item.course_id,
    lessonId: item.lesson_id,
    completedAt: new Date(item.completed_at),
    lastAccessedAt: new Date(item.last_accessed_at)
  }));
}

export async function startCourse(courseId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // First check if a record exists
  const { data: existingProgress } = await supabase
    .from('user_course_progress')
    .select('id')
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .single();
  
  // If record exists, just update last_accessed_at
  if (existingProgress) {
    const { error } = await supabase
      .from('user_course_progress')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', existingProgress.id);

    if (error) {
      console.error('Error updating course access:', error);
      throw error;
    }
    return;
  }

  // If no record exists, create a new one
  const { error } = await supabase
    .from('user_course_progress')
    .insert({
      user_id: user.id,
      course_id: courseId,
      started_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error creating course progress:', error);
    throw error;
  }
}

export async function completeCourse(courseId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_course_progress')
    .update({
      completed_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString()
    })
    .eq('course_id', courseId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error completing course:', error);
    throw error;
  }
}

export async function completeLesson(courseId: string, lessonId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_lesson_progress')
    .upsert({
      user_id: user.id,
      course_id: courseId,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error completing lesson:', error);
    throw error;
  }
}