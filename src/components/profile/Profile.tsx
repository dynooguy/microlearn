import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { User, Award, BookOpen, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { ThemeEditor } from '../admin/ThemeEditor';
import { themeAtom, getThemeClass } from '../../lib/theme';
import type { Course } from '../../types/seatable';
import { fetchCourseData } from '../../services/seatable';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  role?: string;
}

export function Profile() {
  const [theme] = useAtom(themeAtom);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        // Get user data
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get user role
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching user role:', roleError);
          }

          setProfile({
            id: user.id,
            email: user.email!,
            created_at: user.created_at,
            role: roleData?.role || 'user' // Default to 'user' if no role is set
          });
        }

        const courseData = await fetchCourseData();
        const courseTable = courseData.tables.find(t => t.name === 'Kurse');
        if (courseTable) {
          setCourses(courseTable.rows as Course[]);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load profile'));
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${getThemeClass(theme.colors.primary, 'border')}`} aria-label="Laden..." />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Fehler: {error?.message || 'Profil nicht gefunden'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 ${getThemeClass(theme.colors.primary, 'bg', 100)} rounded-full flex items-center justify-center`}>
            <User className={`w-8 h-8 ${getThemeClass(theme.colors.primary, 'text')}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.email}</h1>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
              Mitglied seit {new Date(profile.created_at).toLocaleDateString('de-DE')}
              </p>
              <p className="text-sm text-gray-500">
                Rolle: {profile.role === 'admin' ? 'Administrator' : 'Benutzer'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      {profile.role === 'admin' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Einstellungen</h2>
          <ThemeEditor />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Dein Fortschritt</h2>
        <div className="space-y-6">
          {courses.map(course => {
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

            // TODO: Replace with actual progress data from Supabase
            const completedLessons = 0;
            const progress = (completedLessons / totalLessons) * 100;

            return (
              <div key={course['0000']} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={course.Ev4v[0]}
                  alt={course.LVxv}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {course.LVxv}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      course.Rfrz === '840548'
                        ? 'bg-green-100 text-green-800'
                        : course.Rfrz === '194107'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      <Award className="w-3 h-3 mr-1" />
                      {course.Rfrz === '840548' ? 'Starter' : course.Rfrz === '194107' ? 'Fortgeschritten' : 'Experte'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {totalDuration} min
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {completedLessons} / {totalLessons} lessons
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${getThemeClass(theme.colors.primary)} h-2 rounded-full`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {completedLessons} / {totalLessons} Lektionen
                  </div>
                </div>

                {progress === 100 && (
                  <Button variant="outline" size="sm">
                    Zertifikat herunterladen
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}