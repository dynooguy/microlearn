import { useState, useEffect } from 'react';
import { Trash2, Plus, Key, Check, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { generateAccessCode } from '../../lib/encryption';
import { fetchCourseData } from '../../services/seatable';
import type { Course } from '../../types/seatable';

interface AccessCode {
  id: string;
  code: string;
  name: string;
  lesson_ids: string[];
  created_at: string;
}

export function AccessCodeManager() {
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCode, setNewCode] = useState({
    name: '',
    lesson_ids: [] as string[]
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAccessCodes();
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoadingCourses(true);
    try {
      const data = await fetchCourseData();
      const courseTable = data.tables.find(t => t.name === 'Kurse');
      if (courseTable) {
        setCourses(courseTable.rows as Course[]);
      }
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setLoadingCourses(false);
    }
  }

  async function loadAccessCodes() {
    try {
      const { data, error } = await supabase
        .from('access_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccessCodes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load access codes');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCode() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const code = generateAccessCode();
      const { error } = await supabase
        .from('access_codes')
        .insert({
          code,
          name: newCode.name,
          lesson_ids: newCode.lesson_ids,
          created_by: user.id
        });

      if (error) throw error;

      setIsCreating(false);
      setNewCode({ name: '', lesson_ids: [] });
      loadAccessCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create access code');
    }
  }

  async function handleDeleteCode(id: string) {
    try {
      // First check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!roleData || roleData.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can delete access codes');
      }

      const { error } = await supabase
        .from('access_codes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      loadAccessCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete access code');
    }
  }

  const filteredLessons = courses.flatMap(course =>
    course.Kapitel.flatMap(chapter =>
      chapter.Lektionen.filter(lesson =>
        lesson['920y'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.LVxv.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapter.zrXG.toLowerCase().includes(searchTerm.toLowerCase())
      ).map(lesson => ({
        id: lesson['0000'],
        name: lesson['920y'],
        courseName: course.LVxv,
        chapterName: chapter.zrXG,
        chapterNumber: chapter['0Gbu'],
        lessonNumber: lesson.yt6Q
      }))
    )
  ).sort((a, b) => {
    if (a.courseName !== b.courseName) return a.courseName.localeCompare(b.courseName);
    if (a.chapterNumber !== b.chapterNumber) return a.chapterNumber - b.chapterNumber;
    return a.lessonNumber - b.lessonNumber;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Zugangscodes verwalten</h3>
        <Button
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          <Plus className="w-4 h-4 mr-2" />
          Neuer Code
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {isCreating && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newCode.name}
              onChange={(e) => setNewCode({ ...newCode, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="z.B. Marketing Basics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lektionen auswählen
            </label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                placeholder="Lektionen suchen..."
              />
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-md">
              {loadingCourses ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                </div>
              ) : filteredLessons.length > 0 ? (
                <div className="divide-y">
                  {filteredLessons.map((lesson) => (
                    <label
                      key={lesson.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newCode.lesson_ids.includes(lesson.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCode(prev => ({
                              ...prev,
                              lesson_ids: [...prev.lesson_ids, lesson.id]
                            }));
                          } else {
                            setNewCode(prev => ({
                              ...prev,
                              lesson_ids: prev.lesson_ids.filter(id => id !== lesson.id)
                            }));
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">
                          {lesson.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lesson.courseName} • Kapitel {lesson.chapterNumber}.{lesson.lessonNumber}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Keine Lektionen gefunden
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleCreateCode}
              disabled={!newCode.name || newCode.lesson_ids.length === 0}
            >
              Code erstellen
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreating(false);
                setNewCode({ name: '', lesson_ids: [] });
              }}
            >
              Abbrechen
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {accessCodes.map((code) => (
          <div
            key={code.id}
            className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
          >
            <div>
              <h4 className="font-medium">{code.name}</h4>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <div className="flex items-center">
                  <Key className="w-4 h-4 mr-1" />
                  {code.code}
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  {code.lesson_ids.length} Lektionen
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => handleDeleteCode(code.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md"
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Code löschen</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}