import { Link } from 'react-router-dom';
import { BookOpen, User, Map } from 'lucide-react';
import { useAtom } from 'jotai';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { themeAtom, getThemeClass } from '../../lib/theme';

export function Header() {
  const [theme] = useAtom(themeAtom);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white shadow">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <BookOpen className={`w-8 h-8 text-${theme.colors.primary}-600`} />
            <span className="ml-2 text-xl font-bold text-gray-900">
              {theme.branding.title}
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link to="/courses">
              <Button variant="ghost">Kurse</Button>
            </Link>
            <Link to="/learning-path">
              <Button variant="ghost">
                <Map className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Lernpfade</span>
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline">
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Profil</span>
              </Button>
            </Link>
            <Button onClick={handleSignOut} variant="ghost">
              <span className="hidden sm:inline">Abmelden</span>
              <span className="sm:hidden">×</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}