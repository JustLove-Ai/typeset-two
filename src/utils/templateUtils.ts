import { ContentPage, TemplateType, Template, PageContentAnalysis } from '@/types';

// Template categorization function
export const categorizeTemplate = (templateValue: TemplateType): 'text-only' | 'image-heavy' | 'mixed' => {
  const textOnlyTemplates = ['title', 'text-only', 'table-of-contents'];
  const imageHeavyTemplates = ['full-image', 'image-grid-2', 'image-grid-3', 'image-grid-4', 'image-grid-multi'];

  if (textOnlyTemplates.includes(templateValue)) return 'text-only';
  if (imageHeavyTemplates.includes(templateValue)) return 'image-heavy';
  return 'mixed'; // For mixed templates: text-image-right, text-image-left, image-top-text, text-top-image, hero-banner, color-block-left, color-block-top
};

// Page content analysis function
export const analyzePageContent = (page: ContentPage): PageContentAnalysis => {
  const imageCount = page.images.length;
  const wordCount = page.content.split(' ').filter(word => word.length > 0).length;
  const hasText = page.content.trim().length > 0;

  let contentType: PageContentAnalysis['contentType'] = 'minimal';
  if (imageCount > 2 && wordCount < 50) {
    contentType = 'image-heavy';
  } else if (imageCount === 0 && wordCount > 100) {
    contentType = 'text-heavy';
  } else if (imageCount > 0 && wordCount > 20) {
    contentType = 'balanced';
  }

  return {
    imageCount,
    hasText,
    wordCount,
    contentType
  };
};

// Intelligent template filtering function - hides templates that don't make sense for the content
export const getFilteredTemplatesForPage = (page: ContentPage, templates: Template[]) => {
  const { imageCount } = analyzePageContent(page);

  // Always available templates regardless of image count
  const alwaysAvailable = ['title', 'text-only', 'table-of-contents', 'hero-banner', 'color-block-left', 'color-block-top'];

  return templates.filter(template => {
    // Always show these templates
    if (alwaysAvailable.includes(template.value)) {
      return true;
    }

    // Filter based on image count
    switch (template.value) {
      case 'full-image':
      case 'text-image-right':
      case 'text-image-left':
      case 'image-top-text':
      case 'text-top-image':
        // Single image templates - show if has at least 1 image
        return imageCount >= 1;

      case 'image-grid-2':
        // 2-image grid - show if has at least 2 images
        return imageCount >= 2;

      case 'image-grid-3':
        // 3-image grid - show if has at least 3 images
        return imageCount >= 3;

      case 'image-grid-4':
        // 4-image grid - show if has at least 4 images
        return imageCount >= 4;

      case 'image-grid-multi':
        // Multi-image grid - show if has 3 or more images
        return imageCount >= 3;

      default:
        return true;
    }
  }).sort((a, b) => {
    // Smart sorting - prioritize templates that match the content
    const aCategory = categorizeTemplate(a.value);
    const bCategory = categorizeTemplate(b.value);
    const { contentType } = analyzePageContent(page);

    // Priority scoring based on content analysis
    const getScore = (category: string) => {
      if (contentType === 'text-heavy' && category === 'text-only') return 3;
      if (contentType === 'image-heavy' && category === 'image-heavy') return 3;
      if (contentType === 'balanced' && category === 'mixed') return 3;
      if (category === 'mixed') return 2; // Mixed templates are generally versatile
      return 1;
    };

    return getScore(bCategory) - getScore(aCategory);
  });
};