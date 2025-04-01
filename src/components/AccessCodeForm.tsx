import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/Button'

interface AccessCodeFormProps {
  onSuccess?: (code: string, name: string, lessonIds: string[]) => void;
}

export function AccessCodeForm({ onSuccess }: AccessCodeFormProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Get the access code data
      const { data, error } = await supabase
        .from('access_codes')
        .select('lesson_ids, name')
        .eq('code', code.toUpperCase())
        .single();

      if (error) throw new Error('Ungültiger Code');
      if (!data) throw new Error('Code nicht gefunden');

      // Call onSuccess with the code data
      onSuccess?.(code.toUpperCase(), data.name, data.lesson_ids);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Zugang mit Code
      </h2>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code eingeben
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="CODE EINGEBEN"
              maxLength={8}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || code.length < 8}
        >
          {loading ? 'Überprüfe Code...' : 'Code einlösen'}
        </Button>
      </form>
    </div>
  );
}