import { useState } from 'react';
import { useAtom } from 'jotai';
import { BookOpen, Palette, Type, Image, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { themeAtom, type ThemeConfig, getThemeClass } from '../../lib/theme';

const colorOptions = ['indigo', 'blue', 'green', 'red', 'purple', 'pink', 'orange', 'gray', 'yellow', 'sky', 'lime', 'cyan', 'fuchsia', 'slate'];
const logoOptions = ['BookOpen', 'GraduationCap', 'Book', 'Library', 'School'];

export function ThemeEditor() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTheme, setTempTheme] = useState<ThemeConfig>(theme);

  const handleColorChange = (colorType: keyof ThemeConfig['colors'], color: string) => {
    setTempTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: color
      }
    }));
  };

  const handleSave = () => {
    setTheme(tempTheme);
    setIsEditing(false);
    // TODO: Save to Supabase when backend is ready
  };

  if (!isEditing) {
    return (
      <Button onClick={() => setIsEditing(true)} className="w-full">
        <Palette className="w-4 h-4 mr-2" />
        Design anpassen
      </Button>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Design Einstellungen</h3>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTempTheme(theme);
              setIsEditing(false);
            }}
          >
            Abbrechen
          </Button>
          <Button size="sm" onClick={handleSave}>
            Speichern
          </Button>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium flex items-center">
          <Palette className="w-4 h-4 mr-2" />
          Farben
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(tempTheme.colors).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium capitalize">
                {key}
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(key as keyof ThemeConfig['colors'], color)}
                    className={`w-6 h-6 rounded-full transition-all ${
                      `bg-${color}-500`
                    } ${value === color 
                      ? `ring-2 ring-offset-2 ring-${color}-400` 
                      : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-200'
                    }`}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Branding */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium flex items-center">
          <Image className="w-4 h-4 mr-2" />
          Branding
        </h4>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Logo</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {logoOptions.map(logo => (
                <button
                  key={logo}
                  onClick={() => setTempTheme(prev => ({
                    ...prev,
                    branding: { ...prev.branding, logo }
                  }))}
                  className={`p-2 rounded-lg border transition-all ${
                    tempTheme.branding.logo === logo
                      ? `border-${tempTheme.colors.primary}-500 bg-${tempTheme.colors.primary}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <BookOpen className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium flex items-center">
              <Type className="w-4 h-4 mr-2" />
              Seitentitel
            </label>
            <input
              type="text"
              value={tempTheme.branding.title}
              onChange={e => setTempTheme(prev => ({
                ...prev,
                branding: { ...prev.branding, title: e.target.value }
              }))}
              className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
                shadow-sm focus:border-${tempTheme.colors.primary}-500 
                focus:ring-${tempTheme.colors.primary}-500 sm:text-sm`}
            />
          </div>
        </div>

        {/* Footer Links */}
        <div>
          <label className="text-sm font-medium flex items-center">
            <LinkIcon className="w-4 h-4 mr-2" />
            Footer Links
          </label>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm text-gray-600">Datenschutz URL</label>
              <input
                type="url"
                value={tempTheme.branding.footerLinks.privacy || ''}
                onChange={e => setTempTheme(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding,
                    footerLinks: {
                      ...prev.branding.footerLinks,
                      privacy: e.target.value
                    }
                  }
                }))}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
                  shadow-sm focus:border-${tempTheme.colors.primary}-500 
                  focus:ring-${tempTheme.colors.primary}-500 sm:text-sm`}
                placeholder="https://example.com/privacy"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">AGB URL</label>
              <input
                type="url"
                value={tempTheme.branding.footerLinks.terms || ''}
                onChange={e => setTempTheme(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding,
                    footerLinks: {
                      ...prev.branding.footerLinks,
                      terms: e.target.value
                    }
                  }
                }))}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
                  shadow-sm focus:border-${tempTheme.colors.primary}-500 
                  focus:ring-${tempTheme.colors.primary}-500 sm:text-sm`}
                placeholder="https://example.com/terms"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Impressum URL</label>
              <input
                type="url"
                value={tempTheme.branding.footerLinks.imprint || ''}
                onChange={e => setTempTheme(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding,
                    footerLinks: {
                      ...prev.branding.footerLinks,
                      imprint: e.target.value
                    }
                  }
                }))}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
                  shadow-sm focus:border-${tempTheme.colors.primary}-500 
                  focus:ring-${tempTheme.colors.primary}-500 sm:text-sm`}
                placeholder="https://example.com/imprint"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}