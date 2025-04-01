import { atom } from 'jotai';
import { supabase } from './supabase';

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  branding: {
    logo: string;
    title: string;
    footerLinks: {
      privacy?: string;
      terms?: string;
      imprint?: string;
    };
  };
}

const defaultTheme: ThemeConfig = {
  colors: {
    primary: 'indigo',
    secondary: 'gray',
    accent: 'purple',
    background: 'gray',
    text: 'gray'
  },
  branding: {
    logo: 'BookOpen',
    title: 'Lernplattform by ADLX',
    footerLinks: {}
  }
};

export async function loadThemeSettings(): Promise<Partial<ThemeConfig>> {
  const { data, error } = await supabase
    .from('theme_settings')
    .select('footer_links')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error loading theme settings:', error);
    return {
      branding: {
        ...defaultTheme.branding,
        footerLinks: {}
      }
    };
  }

  return {
    branding: {
      ...defaultTheme.branding,
      footerLinks: data?.footer_links || {}
    }
  };
}

export async function saveThemeSettings(theme: ThemeConfig): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('theme_settings')
    .insert({
      footer_links: theme.branding.footerLinks,
      created_by: user.id
    });

  if (error) {
    console.error('Error saving theme settings:', error);
    throw error;
  }
}
export const themeAtom = atom<ThemeConfig>(defaultTheme);

// Tailwind class generator functions
export const getThemeClass = (color: string, type: 'bg' | 'text' | 'border' = 'bg', shade: number = 600) => {
  if (!color) return '';
  return `${type}-${color}-${shade}`;
};

export const getTextClass = (color: string, shade: number = 600) => {
  if (!color) return '';
  return getThemeClass(color, 'text', shade);
};

export const getBgClass = (color: string, shade: number = 600) => {
  if (!color) return '';
  return getThemeClass(color, 'bg', shade);
};

// Button variants using theme
export const getButtonVariants = (theme: ThemeConfig) => {
  return {
    default: `${getBgClass(theme.colors.primary)} text-white hover:${getBgClass(theme.colors.primary, 700)}`,
    outline: `border border-${theme.colors.secondary}-300 bg-white hover:bg-${theme.colors.secondary}-100 text-${theme.colors.text}-700`,
    ghost: `hover:bg-${theme.colors.secondary}-100 text-${theme.colors.text}-700`
  };
};