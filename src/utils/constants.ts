import { Template } from '@/types';

export const TEMPLATES: Template[] = [
  { value: 'title', label: 'Title Page' },
  { value: 'text-image-right', label: 'Text Left, Image Right' },
  { value: 'text-image-left', label: 'Image Left, Text Right' },
  { value: 'image-top-text', label: 'Image Top, Text Bottom' },
  { value: 'text-top-image', label: 'Text Top, Image Bottom' },
  { value: 'text-only', label: 'Text Only' },
  { value: 'table-of-contents', label: 'Table of Contents' },
  { value: 'full-image', label: 'Full Image' },
  { value: 'image-grid-2', label: '2-Image Grid' },
  { value: 'image-grid-3', label: '3-Image Grid' },
  { value: 'image-grid-4', label: '4-Image Grid' },
  { value: 'image-grid-multi', label: 'Multi-Image Grid' },
  { value: 'color-block-left', label: 'Color Sidebar' },
  { value: 'color-block-top', label: 'Color Header' },
  { value: 'hero-banner', label: 'Hero Banner' }
];