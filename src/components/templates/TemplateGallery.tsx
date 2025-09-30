import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ContentPage, TemplateType, GlobalTheme, Template } from '@/types';
import { TemplateRenderer } from './TemplateRenderer';
import { getFilteredTemplatesForPage } from '@/utils/templateUtils';
import { TEMPLATES } from '@/utils/constants';

interface TemplateGalleryProps {
  page: ContentPage;
  currentTheme: GlobalTheme;
  onTemplateSelect: (pageId: number, template: TemplateType) => void;
  onClose: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  page,
  currentTheme,
  onTemplateSelect,
  onClose
}) => {
  const filteredTemplates = getFilteredTemplatesForPage(page, TEMPLATES);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 300, duration: 0.4 }}
      className="overflow-hidden mt-4"
    >
      <div className="p-4 bg-muted/30 border border-border rounded-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm hover:bg-background text-foreground p-1.5 rounded-lg shadow-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-6 overflow-x-auto pb-2 template-gallery-container">
          {filteredTemplates.map((template) => {
            const isSelected = page.template === template.value;
            return (
              <motion.div
                key={template.value}
                onClick={() => {
                  onTemplateSelect(page.id, template.value);
                }}
                className={`cursor-pointer p-2 rounded-lg border transition-all flex-shrink-0 ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 hover:shadow-sm'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-64 h-48 bg-white border border-border rounded overflow-hidden relative mb-2">
                  <div
                    className="h-full w-full"
                    style={{
                      background: template.value === 'title' ? currentTheme.coverBackground.value : currentTheme.colors.background,
                      fontFamily: currentTheme.typography.bodyFont,
                      fontSize: '0.3rem',
                      color: template.value === 'title' ? '#ffffff' : currentTheme.colors.text
                    }}
                  >
                    <TemplateRenderer
                      page={page}
                      templateType={template.value}
                      theme={currentTheme}
                      isPreview={true}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};