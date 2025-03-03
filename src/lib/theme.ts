import { atom } from 'jotai';

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