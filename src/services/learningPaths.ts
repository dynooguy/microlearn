import { supabase } from '../lib/supabase';

export interface LearningPath {
  id: string;
  name: string;
  lesson_ids: string[];
  created_at: string;
  access_code?: string;
}

export interface NewLearningPath {
  name: string;
  lesson_ids: string[];
  access_code?: string;
}

export async function getLearningPaths(): Promise<LearningPath[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function saveLearningPath(path: NewLearningPath): Promise<LearningPath> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('learning_paths')
    .insert({
      user_id: user.id,
      name: path.name,
      lesson_ids: path.lesson_ids,
      access_code: path.access_code
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLearningPath(id: string): Promise<void> {
  const { error } = await supabase
    .from('learning_paths')
    .delete()
    .eq('id', id);

  if (error) throw error;
}