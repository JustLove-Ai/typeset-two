import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Upload, Palette, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageTrayTab } from '@/types';

interface ImageLibraryProps {
  isOpen: boolean;
  activeTab: ImageTrayTab;
  availableImages: string[];
  uploadedImages: string[];
  aiImagePrompt: string;
  isGeneratingImage: boolean;
  onClose: () => void;
  onTabChange: (tab: ImageTrayTab) => void;
  onImageSelect: (imageUrl: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIPromptChange: (prompt: string) => void;
  onGenerateAI: () => void;
}

export const ImageLibrary: React.FC<ImageLibraryProps> = ({
  isOpen,
  activeTab,
  availableImages,
  uploadedImages,
  aiImagePrompt,
  isGeneratingImage,
  onClose,
  onTabChange,
  onImageSelect,
  onFileUpload,
  onAIPromptChange,
  onGenerateAI
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border z-50 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Image Library</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <button
                onClick={() => onTabChange('recent')}
                className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'recent'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Clock className="w-3 h-3 mr-1" />
                Recent
              </button>
              <button
                onClick={() => onTabChange('upload')}
                className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Upload className="w-3 h-3 mr-1" />
                Upload
              </button>
              <button
                onClick={() => onTabChange('ai')}
                className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'ai'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Palette className="w-3 h-3 mr-1" />
                AI Generate
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'recent' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {availableImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer group"
                      onClick={() => onImageSelect(imageUrl)}
                    >
                      <img
                        src={imageUrl}
                        alt={`Library image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-border group-hover:border-primary transition-colors"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Plus className="w-3 h-3 text-primary-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload your own images
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      asChild
                    >
                      <span>Choose Files</span>
                    </Button>
                  </label>
                </div>

                {uploadedImages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Uploaded Images</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {uploadedImages.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="relative cursor-pointer group"
                          onClick={() => onImageSelect(imageUrl)}
                        >
                          <img
                            src={imageUrl}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-border group-hover:border-primary transition-colors"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Plus className="w-3 h-3 text-primary-foreground" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Describe the image you want to generate
                  </label>
                  <Textarea
                    value={aiImagePrompt}
                    onChange={(e) => onAIPromptChange(e.target.value)}
                    placeholder="A professional photo of a tropical beach with palm trees and crystal clear water..."
                    className="min-h-[100px] resize-none"
                  />
                  <Button
                    onClick={onGenerateAI}
                    disabled={!aiImagePrompt.trim() || isGeneratingImage}
                    className="w-full bg-purple-gradient text-white border-0 hover:bg-purple-gradient"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    {isGeneratingImage ? 'Generating Image...' : 'Generate Image'}
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  💡 Tip: Be specific about style, colors, composition, and mood for better results.
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};