import { ContentPage, TemplateType } from '@/types';

// Generate new page ID
export const generatePageId = (existingPages: ContentPage[]): number => {
  return Math.max(...existingPages.map(p => p.id), 0) + 1;
};

// Add image to a specific page
export const addImageToPage = (pages: ContentPage[], pageId: number, imageUrl: string): ContentPage[] => {
  return pages.map(page =>
    page.id === pageId
      ? { ...page, images: [...page.images, imageUrl] }
      : page
  );
};

// Remove image from a specific page
export const removeImageFromPage = (pages: ContentPage[], pageId: number, imageUrl: string): ContentPage[] => {
  return pages.map(page =>
    page.id === pageId
      ? { ...page, images: page.images.filter(img => img !== imageUrl) }
      : page
  );
};

// Create a new page
export const createNewPage = (existingPages: ContentPage[]): ContentPage => {
  const newId = generatePageId(existingPages);
  return {
    id: newId,
    title: "New Page",
    content: "Add your content here...",
    template: 'text-only' as TemplateType,
    images: [],
    showPrompt: false,
    promptText: ''
  };
};

// Duplicate a page
export const duplicatePage = (page: ContentPage, existingPages: ContentPage[]): ContentPage => {
  const newId = generatePageId(existingPages);
  return {
    ...page,
    id: newId,
    title: `${page.title} (Copy)`,
  };
};

// Update page template
export const updatePageTemplate = (pages: ContentPage[], pageId: number, template: TemplateType): ContentPage[] => {
  return pages.map(page =>
    page.id === pageId
      ? { ...page, template }
      : page
  );
};

// Update page content
export const updatePageContent = (pages: ContentPage[], pageId: number, updates: Partial<ContentPage>): ContentPage[] => {
  return pages.map(page =>
    page.id === pageId
      ? { ...page, ...updates }
      : page
  );
};

// Delete a page
export const deletePage = (pages: ContentPage[], pageId: number): ContentPage[] => {
  return pages.filter(page => page.id !== pageId);
};

// Get page by ID
export const getPageById = (pages: ContentPage[], pageId: number): ContentPage | undefined => {
  return pages.find(page => page.id === pageId);
};