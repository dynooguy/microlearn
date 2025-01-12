import React, { useState, useEffect } from 'react';
import { User, UserCircle, Lock, Download, Award, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Course } from '../types';
import { generateCertificatePDF } from '../utils/certificate';

interface CompletedCourse extends Course {
  completionDate: string;
}

interface UserProfileProps {
  email: string;
  onSignOut: () => void;
  onClose: () => void;
  courses: Course[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ email, onSignOut, onClose, courses }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([]);

  useEffect(() => {
    loadCompletedCourses();
  }, [courses]);

  const loadCompletedCourses = async () => {
    try {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('completed', true);

      if (progress) {
        const completed = courses.map(course => {
          const courseProgress = progress.filter(p => 
            course.modules.some(m => m.id === p.module_id)
          );

          const totalLessons = course.modules.reduce(
            (acc, module) => acc + module.lessons.length, 
            0
          );

          if (courseProgress.length === totalLessons) {
            const latestCompletion = courseProgress.reduce(
              (latest, curr) => {
                const currDate = new Date(curr.completion_date);
                return latest < currDate ? currDate : latest;
              },
              new Date(0)
            );

            return {
              ...course,
              completionDate: latestCompletion.toLocaleDateString('de-DE')
            };
          }
          return null;
        }).filter((course): course is CompletedCourse => course !== null);

        setCompletedCourses(completed);
      }
    } catch (err) {
      console.error('Error loading completed courses:', err);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccess('Passwort erfolgreich geändert');
      setShowPasswordForm(false);
      setNewPassword('');
    } catch (err) {
      setError('Fehler beim Ändern des Passworts');
    }
  };

  const handleDownloadCertificate = async (course: CompletedCourse) => {
    try {
      const pdfBytes = await generateCertificatePDF(course, email, course.completionDate);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${course.title.toLowerCase().replace(/\s+/g, '-')}-zertifikat.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating certificate:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <button
        onClick={onClose}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Zurück zur Kursübersicht
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-amber-100 rounded-full">
            <UserCircle className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Mein Profil</h2>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Kontoeinstellungen</h3>
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Passwort ändern</span>
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    Neues Passwort
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    required
                    minLength={6}
                  />
                </div>
                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}
                {success && (
                  <div className="text-green-600 text-sm">{success}</div>
                )}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                  >
                    Speichern
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setError(null);
                      setSuccess(null);
                    }}
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Abbrechen
                  </button>
                </div>
              </form>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Abgeschlossene Kurse</h3>
            {completedCourses.length > 0 ? (
              <div className="space-y-4">
                {completedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Award className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{course.title}</h4>
                        <p className="text-sm text-gray-600">
                          Abgeschlossen am {course.completionDate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadCertificate(course)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Zertifikat</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                Sie haben noch keine Kurse abgeschlossen.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};