// Template types for different page layouts
export type TemplateType =
  | 'title'
  | 'text-image-right'
  | 'text-image-left'
  | 'image-top-text'
  | 'text-top-image'
  | 'text-only'
  | 'table-of-contents'
  | 'full-image'
  | 'image-grid-2'
  | 'image-grid-3'
  | 'image-grid-4'
  | 'image-grid-multi'
  | 'color-block-left'
  | 'color-block-top'
  | 'color-split'
  | 'accent-sidebar'
  | 'magazine-layout'
  | 'hero-banner'
  | 'timeline';

// Global theme interface for premium styling
export interface GlobalTheme {
  name: string;
  category: string;
  description: string;
  typography: {
    headingFont: string;
    bodyFont: string;
    h1Size: string;
    h2Size: string;
    bodySize: string;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
    accent: string;
  };
  coverBackground: {
    type: 'solid' | 'gradient' | 'pattern';
    value: string;
    gradient?: {
      from: string;
      to: string;
      direction: string;
    };
  };
  banners: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
  imageStyle: {
    borderRadius: string;
    borderWidth: string;
    borderColor: string;
    shadow: string;
    bordersEnabled: boolean;
  };
}

// Page/Content block type definition
export interface ContentPage {
  id: number;
  title: string;
  content: string;
  images: string[];
  template: TemplateType;
  subtitle?: string;
  isGenerating?: boolean;
  showPrompt?: boolean;
  promptText?: string;
}

// Image tray tab types
export type ImageTrayTab = 'recent' | 'upload' | 'ai';

// Grid layout types
export type GridLayout = 'single' | 'double';

// Theme tab types
export type ThemeTab = 'themes' | 'typography' | 'colors' | 'backgrounds';

// Template interface
export interface Template {
  value: TemplateType;
  label: string;
  category?: string;
}

// Page content analysis interface
export interface PageContentAnalysis {
  imageCount: number;
  hasText: boolean;
  wordCount: number;
  contentType: 'text-heavy' | 'image-heavy' | 'balanced' | 'minimal';
}