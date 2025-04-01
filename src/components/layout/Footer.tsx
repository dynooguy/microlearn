import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { BookOpen } from 'lucide-react';
import { themeAtom, getThemeClass } from '../../lib/theme';

export function Footer() {
  const [theme] = useAtom(themeAtom);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-6">
            <Link to="/" className="flex items-center">
              <BookOpen className={`w-6 h-6 ${getThemeClass(theme.colors.primary, 'text')}`} />
              <span className="ml-2 text-sm font-semibold text-gray-900 tracking-wider uppercase">
                {theme.branding.title}
              </span>
            </Link>
            <p className="text-sm text-gray-500">
              Erweitern Sie Ihr Wissen mit unseren interaktiven Online-Kursen.
              Lernen Sie in Ihrem eigenen Tempo und erreichen Sie Ihre Ziele.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-6">
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Navigation
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/courses" className="text-sm text-gray-500 hover:text-gray-900">
                    Kurse
                  </Link>
                </li>
                <li>
                  <Link to="/learning-path" className="text-sm text-gray-500 hover:text-gray-900">
                    Lernpfade
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-sm text-gray-500 hover:text-gray-900">
                    Profil
                  </Link>
                </li>
              </ul>
            </div>
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Rechtliches
              </h3>
              {(theme.branding.footerLinks.privacy ||
                theme.branding.footerLinks.terms ||
                theme.branding.footerLinks.imprint) && (
                <ul className="mt-4 space-y-2">
                  {theme.branding.footerLinks.privacy && (
                    <li>
                      <a
                        href={theme.branding.footerLinks.privacy}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-gray-900"
                      >
                        Datenschutz
                      </a>
                    </li>
                  )}
                  {theme.branding.footerLinks.terms && (
                    <li>
                      <a
                        href={theme.branding.footerLinks.terms}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-gray-900"
                      >
                        AGB
                      </a>
                    </li>
                  )}
                  {theme.branding.footerLinks.imprint && (
                    <li>
                      <a
                        href={theme.branding.footerLinks.imprint}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-gray-900"
                      >
                        Impressum
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {currentYear} {theme.branding.title}. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}