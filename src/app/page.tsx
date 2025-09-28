"use client";

import { useState, useRef, useCallback } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Wand2, Download, Image as ImageIcon, Trash2, Copy, MoreVertical, Expand, LayoutTemplate, Type, ImageIcon as ImageIconAlt, Grid3X3, Rows3, Send, X, Upload, Palette, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Template types for different page layouts
type TemplateType = 'title' | 'text-image-right' | 'text-image-left' | 'image-top-text' | 'text-top-image' | 'text-only' | 'table-of-contents';

// Page/Content block type definition
interface ContentPage {
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

export default function Home() {
  const [pages, setPages] = useState<ContentPage[]>([
    {
      id: 1,
      title: "The Top 10 Vacation Destination for Families",
      content: "Discover the best family-friendly vacation spots that offer unforgettable experiences for all ages.",
      template: 'title' as TemplateType,
      subtitle: "A Complete Guide to Family Travel",
      images: [],
      showPrompt: false,
      promptText: ''
    },
    {
      id: 2,
      title: "Florida, USA: The #1 Vacation Destination",
      content: "Families love to travel to Florida because of its spectacular beaches and attractions. From the beautiful Gulf Coast to the world-famous theme parks, Florida has something for everyone. The year-round sunshine and warm temperatures make it the perfect destination for a family vacation. With its many beaches, theme parks, and attractions, Florida is a great place for families to explore and create lasting memories.",
      template: 'text-image-right' as TemplateType,
      images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"],
      showPrompt: false,
      promptText: ''
    },
    {
      id: 3,
      title: "Our Top Vacation Resources",
      content: "Access our curated collection of travel guides, booking tools, and insider tips to make your family vacation planning effortless.",
      template: 'text-only' as TemplateType,
      images: [],
      showPrompt: false,
      promptText: ''
    },
    {
      id: 4,
      title: "Table of Contents",
      content: "What You'll Discover Inside:\n\n1. Top Family Destinations\n2. Budget Planning Guide\n3. Travel Tips & Tricks\n4. Safety Considerations\n5. Packing Essentials",
      template: 'table-of-contents' as TemplateType,
      images: [],
      showPrompt: false,
      promptText: ''
    }
  ]);

  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [availableImages, setAvailableImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1464822759844-d150ad6d1dde?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=225&fit=crop"
  ]);
  const [showImageTray, setShowImageTray] = useState<boolean>(false);
  const [currentPageForImage, setCurrentPageForImage] = useState<number | null>(null);
  const [imageTrayTab, setImageTrayTab] = useState<'recent' | 'upload' | 'ai'>('recent');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [aiImagePrompt, setAiImagePrompt] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(0);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [gridLayout, setGridLayout] = useState<'single' | 'double'>('double');

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const MIN_PANEL_WIDTH = 400;
  const MAX_PANEL_WIDTH = 800;

  React.useEffect(() => {
    if (containerRef.current && rightPanelWidth === 0) {
      const containerWidth = containerRef.current.offsetWidth;
      const defaultRightWidth = Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, containerWidth * 0.6));
      setRightPanelWidth(defaultRightWidth);
    }
  }, [rightPanelWidth, MIN_PANEL_WIDTH, MAX_PANEL_WIDTH]);

  // Auto-select template based on number of images
  const getAutoTemplate = (imageCount: number): TemplateType => {
    if (imageCount === 0) return 'text-only';
    if (imageCount === 1) return 'text-image-right';
    if (imageCount >= 2) return 'image-top-text';
    return 'text-only';
  };

  // Add image to page
  const addImageToPage = (pageId: number, imageUrl: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page || page.images.includes(imageUrl)) return;

    const newImages = [...page.images, imageUrl];
    const newTemplate = getAutoTemplate(newImages.length);

    updatePage(pageId, {
      images: newImages,
      template: newTemplate
    });
  };

  // Remove image from page
  const removeImageFromPage = (pageId: number, imageUrl: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    const newImages = page.images.filter(img => img !== imageUrl);
    const newTemplate = getAutoTemplate(newImages.length);

    updatePage(pageId, {
      images: newImages,
      template: newTemplate
    });
  };

  // Toggle prompt input for AI generation
  const togglePromptInput = (pageId: number) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    updatePage(pageId, {
      showPrompt: !page.showPrompt,
      promptText: page.promptText || ''
    });
  };

  // Generate AI content with user prompt
  const generateAIContent = async (pageId: number, prompt: string) => {
    updatePage(pageId, {
      isGenerating: true,
      showPrompt: false
    });

    // Simulate AI generation delay
    setTimeout(() => {
      const aiContent = `AI-generated content based on "${prompt}": This comprehensive section explores the topic in detail, providing valuable insights and engaging information that aligns with the user's specific requirements. The content maintains professional quality while addressing the key points outlined in the prompt.`;

      updatePage(pageId, {
        content: aiContent,
        isGenerating: false,
        showPrompt: false, // Ensure we show the textarea with generated content
        promptText: ''
      });
    }, 2000);
  };

  // Handle prompt submission
  const handlePromptSubmit = (pageId: number) => {
    const page = pages.find(p => p.id === pageId);
    if (!page || !page.promptText?.trim()) return;

    generateAIContent(pageId, page.promptText.trim());
  };

  // Cancel prompt input
  const cancelPrompt = (pageId: number) => {
    updatePage(pageId, {
      showPrompt: false,
      promptText: ''
    });
  };

  // Open image tray for specific page
  const openImageTray = (pageId: number) => {
    setCurrentPageForImage(pageId);
    setShowImageTray(true);
  };

  // Close image tray
  const closeImageTray = () => {
    setShowImageTray(false);
    setCurrentPageForImage(null);
    setAiImagePrompt('');
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImages(prev => [...prev, imageUrl]);
        setAvailableImages(prev => [...prev, imageUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Generate AI image
  const generateAIImage = async () => {
    if (!aiImagePrompt.trim()) return;

    setIsGeneratingImage(true);

    // Simulate AI image generation
    setTimeout(() => {
      // In real implementation, this would call an AI image service
      const generatedImageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400&h=225&fit=crop&q=80`;

      setAvailableImages(prev => [generatedImageUrl, ...prev]);
      setAiImagePrompt('');
      setIsGeneratingImage(false);

      // Auto-add to current page if one is selected
      if (currentPageForImage) {
        addImageToPage(currentPageForImage, generatedImageUrl);
      }
    }, 3000);
  };

  // Add image from tray to page
  const addImageFromTray = (imageUrl: string) => {
    if (currentPageForImage) {
      addImageToPage(currentPageForImage, imageUrl);
      closeImageTray();
    }
  };

  const addPage = () => {
    const newPage: ContentPage = {
      id: Math.max(...pages.map(p => p.id), 0) + 1,
      title: `Page ${pages.length + 1}`,
      content: "Enter your content here...",
      template: 'text-only' as TemplateType,
      images: [],
      showPrompt: false,
      promptText: ''
    };
    setPages([...pages, newPage]);

    // Auto-scroll to the new page after a brief delay to ensure DOM update
    setTimeout(() => {
      scrollToPage(newPage.id);
    }, 100);
  };

  const updatePage = (id: number, updates: Partial<ContentPage>) => {
    setPages(pages.map(page =>
      page.id === id ? { ...page, ...updates } : page
    ));
  };

  // Auto-scroll to selected page
  const scrollToPage = (pageId: number) => {
    setSelectedPage(pageId);

    // Scroll left panel to the selected page
    setTimeout(() => {
      const leftElement = document.querySelector(`[data-page-id="${pageId}"]`);
      if (leftElement && leftPanelRef.current) {
        leftElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Scroll right panel to the selected preview
      const rightElement = document.querySelector(`[data-preview-id="${pageId}"]`);
      if (rightElement && rightPanelRef.current) {
        rightElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const deletePage = (id: number) => {
    if (pages.length <= 1) return;
    const newPages = pages.filter(page => page.id !== id);
    setPages(newPages);

    if (selectedPage === id) {
      setSelectedPage(newPages[0]?.id || 1);
    }
  };

  const duplicatePage = (id: number) => {
    const pageToDuplicate = pages.find(page => page.id === id);
    if (!pageToDuplicate) return;

    const newPage: ContentPage = {
      ...pageToDuplicate,
      id: Math.max(...pages.map(p => p.id)) + 1,
      title: `${pageToDuplicate.title} (Copy)`,
      isGenerating: false,
      showPrompt: false,
      promptText: ''
    };

    const pageIndex = pages.findIndex(page => page.id === id);
    const newPages = [...pages];
    newPages.splice(pageIndex + 1, 0, newPage);
    setPages(newPages);
    setSelectedPage(newPage.id);
  };

  const movePage = (id: number, direction: 'up' | 'down') => {
    const currentIndex = pages.findIndex(page => page.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= pages.length) return;

    const newPages = [...pages];
    [newPages[currentIndex], newPages[newIndex]] = [newPages[newIndex], newPages[currentIndex]];

    // Renumber pages based on their new order
    const renumberedPages = newPages.map((page, index) => ({
      ...page,
      id: index + 1
    }));

    setPages(renumberedPages);

    // Update selected page to maintain selection after renumbering
    const movedPage = renumberedPages[newIndex];
    setSelectedPage(movedPage.id);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    const clampedWidth = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, newWidth));

    setRightPanelWidth(clampedWidth);
  }, [isResizing, MIN_PANEL_WIDTH, MAX_PANEL_WIDTH]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add event listeners for mouse events
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const getTemplateIcon = (template: TemplateType) => {
    switch (template) {
      case 'title': return <Type className="w-4 h-4" />;
      case 'text-image-right': return <LayoutTemplate className="w-4 h-4" />;
      case 'text-image-left': return <LayoutTemplate className="w-4 h-4" />;
      case 'image-top-text': return <ImageIconAlt className="w-4 h-4" />;
      case 'text-top-image': return <ImageIconAlt className="w-4 h-4" />;
      case 'text-only': return <Type className="w-4 h-4" />;
      case 'table-of-contents': return <LayoutTemplate className="w-4 h-4" />;
      default: return <LayoutTemplate className="w-4 h-4" />;
    }
  };

  const templates: { value: TemplateType; label: string }[] = [
    { value: 'title', label: 'Title Page' },
    { value: 'text-image-right', label: 'Text Left, Image Right' },
    { value: 'text-image-left', label: 'Image Left, Text Right' },
    { value: 'image-top-text', label: 'Image Top, Text Bottom' },
    { value: 'text-top-image', label: 'Text Top, Image Bottom' },
    { value: 'text-only', label: 'Text Only' },
    { value: 'table-of-contents', label: 'Table of Contents' }
  ];

  return (
    <div className="h-screen bg-background text-foreground flex flex-col dark overflow-hidden">
      {/* Top Action Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Ebook Designer</h1>
        </div>

        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={addPage}
              className="bg-purple-gradient hover:bg-purple-gradient text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Page
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-purple-gradient hover:bg-purple-gradient text-white border-0"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </motion.div>
        </div>

        <div className="text-right flex items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">Preview</h2>
            <p className="text-sm text-muted-foreground">Professional layout preview</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGridLayout(gridLayout === 'single' ? 'double' : 'single')}
              className="border-border hover:bg-accent"
            >
              {gridLayout === 'single' ? (
                <Grid3X3 className="w-4 h-4" />
              ) : (
                <Rows3 className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div ref={containerRef} className="flex-1 flex h-full overflow-hidden">
        {/* Left Panel - Content Editor */}
        <div ref={leftPanelRef} className="flex-1 p-6 overflow-y-auto bg-background h-full" style={{ scrollBehavior: 'smooth' }}>
          <div className="space-y-6 max-w-4xl">

            {/* Pages Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pages</h3>
              <AnimatePresence>
                {pages.map((page, index) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    layout
                  >
                    <Card
                      data-page-id={page.id}
                      className={`page-card p-6 cursor-pointer ${
                        selectedPage === page.id ? "selected" : ""
                      }`}
                      onClick={() => scrollToPage(page.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="page-number">
                          {page.id}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Input
                              value={page.title}
                              onChange={(e) => updatePage(page.id, { title: e.target.value })}
                              className="text-lg font-semibold bg-transparent border-0 p-0 h-auto focus-visible:ring-0"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-xs bg-purple-gradient text-white border-0 hover:bg-purple-gradient"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePromptInput(page.id);
                                }}
                                disabled={page.isGenerating}
                              >
                                <Wand2 className="w-3 h-3 mr-1" />
                                {page.isGenerating ? 'Generating...' : page.showPrompt ? 'Cancel' : 'AI'}
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {getTemplateIcon(page.template)}
                                    <span className="ml-2">{templates.find(t => t.value === page.template)?.label}</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {templates.map((template) => (
                                    <DropdownMenuItem
                                      key={template.value}
                                      onClick={() => updatePage(page.id, { template: template.value })}
                                    >
                                      {getTemplateIcon(template.value)}
                                      <span className="ml-2">{template.label}</span>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-accent"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => duplicatePage(page.id)}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => movePage(page.id, 'up')}
                                    disabled={index === 0}
                                  >
                                    <ChevronUp className="w-4 h-4 mr-2" />
                                    Move Up
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => movePage(page.id, 'down')}
                                    disabled={index === pages.length - 1}
                                  >
                                    <ChevronDown className="w-4 h-4 mr-2" />
                                    Move Down
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => deletePage(page.id)}
                                    disabled={pages.length <= 1}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          {page.showPrompt ? (
                            <div className="mt-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                              <div className="mb-3">
                                <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                  What should this section be about?
                                </label>
                              </div>
                              <Textarea
                                value={page.promptText || ''}
                                onChange={(e) => updatePage(page.id, { promptText: e.target.value })}
                                placeholder="Describe what you want this section to cover... (e.g., 'Explain the benefits of family travel to Florida')"
                                className="min-h-[80px] bg-white dark:bg-background border border-purple-200 dark:border-purple-600 rounded-md p-3 resize-none focus-visible:ring-purple-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  className="bg-purple-gradient text-white border-0 hover:bg-purple-gradient"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePromptSubmit(page.id);
                                  }}
                                  disabled={!page.promptText?.trim()}
                                >
                                  <Send className="w-3 h-3 mr-1" />
                                  Generate
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cancelPrompt(page.id);
                                  }}
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Textarea
                              value={page.content}
                              onChange={(e) => updatePage(page.id, { content: e.target.value })}
                              placeholder="Write your page content here..."
                              className="min-h-[100px] mt-3 bg-transparent border-0 p-0 resize-none focus-visible:ring-0"
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}

                          {/* Images Section for this page */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium">Page Images ({page.images.length})</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openImageTray(page.id);
                                }}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Image
                              </Button>
                            </div>

                            {page.images.length > 0 && (
                              <div className="grid grid-cols-3 gap-2">
                                {page.images.map((imageUrl, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="relative cursor-pointer group"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeImageFromPage(page.id, imageUrl);
                                    }}
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={`Page image ${imgIndex + 1}`}
                                      className="w-full h-12 object-cover rounded border border-primary"
                                    />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Trash2 className="w-2 h-2 text-white" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className={`relative border-l border-border ${isResizing ? 'bg-primary/20' : 'hover:bg-primary/10'} transition-colors group`}
          style={{ width: '4px' }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 cursor-col-resize" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Expand className="w-3 h-3 text-primary rotate-90" />
          </div>
        </div>

        {/* Right Panel - Professional Preview */}
        <motion.div
          ref={rightPanelRef}
          className="border-r border-border p-6 overflow-y-auto bg-background flex-shrink-0 h-full"
          style={{ width: rightPanelWidth, scrollBehavior: 'smooth' }}
          animate={{ width: rightPanelWidth }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <div className={`${gridLayout === 'double' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
            {pages.map((page) => (
              <motion.div
                key={page.id}
                data-preview-id={page.id}
                className={`professional-preview cursor-pointer ${
                  selectedPage === page.id ? "selected" : ""
                }`}
                onClick={() => scrollToPage(page.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <div className={`preview-container bg-white text-black ${gridLayout === 'double' ? 'p-6 pt-10' : 'p-8 pt-12'} rounded-lg shadow-lg aspect-[3/4] relative overflow-hidden`}>
                  {page.template === 'title' && (
                    <div className="h-full flex flex-col justify-center items-center text-center px-4">
                      <h1 className={`${gridLayout === 'double' ? 'text-lg' : 'text-3xl'} font-bold mb-4 leading-tight`}>{page.title}</h1>
                      {page.subtitle && (
                        <p className={`${gridLayout === 'double' ? 'text-xs' : 'text-lg'} text-gray-600 mb-6`}>{page.subtitle}</p>
                      )}
                      <div className={`${gridLayout === 'double' ? 'text-xs' : 'text-base'} text-gray-700 max-w-md leading-relaxed`}>{page.content}</div>
                    </div>
                  )}

                  {page.template === 'text-image-right' && (
                    <div className={`h-full flex ${gridLayout === 'double' ? 'gap-2' : 'gap-6'} px-2`}>
                      <div className="flex-1 flex flex-col">
                        <h2 className={`${gridLayout === 'double' ? 'text-sm' : 'text-2xl'} font-bold mb-3`}>{page.title}</h2>
                        <p className={`${gridLayout === 'double' ? 'text-xs' : 'text-base'} leading-relaxed text-gray-700`}>{page.content}</p>
                      </div>
                      {page.images.length > 0 && (
                        <div className="w-1/2">
                          <img
                            src={page.images[0]}
                            alt={page.title}
                            className={`w-full ${gridLayout === 'double' ? 'h-20' : 'h-48'} object-cover rounded-lg`}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {page.template === 'text-image-left' && (
                    <div className={`h-full flex ${gridLayout === 'double' ? 'gap-2' : 'gap-6'} px-2`}>
                      {page.images.length > 0 && (
                        <div className="w-1/2">
                          <img
                            src={page.images[0]}
                            alt={page.title}
                            className={`w-full ${gridLayout === 'double' ? 'h-20' : 'h-48'} object-cover rounded-lg`}
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col">
                        <h2 className={`${gridLayout === 'double' ? 'text-sm' : 'text-2xl'} font-bold mb-3`}>{page.title}</h2>
                        <p className={`${gridLayout === 'double' ? 'text-xs' : 'text-base'} leading-relaxed text-gray-700`}>{page.content}</p>
                      </div>
                    </div>
                  )}

                  {page.template === 'image-top-text' && (
                    <div className="h-full flex flex-col px-2">
                      {page.images.length > 0 && (
                        <div className={`${gridLayout === 'double' ? 'mb-2' : 'mb-6'}`}>
                          {page.images.length === 1 ? (
                            <img
                              src={page.images[0]}
                              alt={page.title}
                              className={`w-full ${gridLayout === 'double' ? 'h-16' : 'h-40'} object-cover rounded-lg`}
                            />
                          ) : (
                            <div className="grid grid-cols-2 gap-1">
                              {page.images.slice(0, 4).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`${page.title} ${idx + 1}`}
                                  className={`w-full ${gridLayout === 'double' ? 'h-8' : 'h-20'} object-cover rounded-lg`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <h2 className={`${gridLayout === 'double' ? 'text-sm' : 'text-2xl'} font-bold mb-3`}>{page.title}</h2>
                      <p className={`${gridLayout === 'double' ? 'text-xs' : 'text-base'} leading-relaxed text-gray-700 flex-1`}>{page.content}</p>
                    </div>
                  )}

                  {page.template === 'text-top-image' && (
                    <div className="h-full flex flex-col px-2">
                      <h2 className={`${gridLayout === 'double' ? 'text-sm' : 'text-2xl'} font-bold mb-3`}>{page.title}</h2>
                      <p className={`${gridLayout === 'double' ? 'text-xs' : 'text-base'} leading-relaxed text-gray-700 mb-4`}>{page.content}</p>
                      {page.images.length > 0 && (
                        <div className="flex-1">
                          <img
                            src={page.images[0]}
                            alt={page.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {page.template === 'text-only' && (
                    <div className="h-full flex flex-col px-4">
                      <h2 className={`${gridLayout === 'double' ? 'text-sm' : 'text-2xl'} font-bold mb-4`}>{page.title}</h2>
                      <div className={`${gridLayout === 'double' ? 'text-xs' : 'text-base'} leading-relaxed text-gray-700 whitespace-pre-line`}>
                        {page.content}
                      </div>
                    </div>
                  )}

                  {page.template === 'table-of-contents' && (
                    <div className="h-full px-4">
                      <h2 className={`${gridLayout === 'double' ? 'text-sm' : 'text-3xl'} font-bold mb-4 text-center`}>{page.title}</h2>
                      <div className={`bg-cyan-50 ${gridLayout === 'double' ? 'p-2' : 'p-6'} rounded-lg`}>
                        <div className={`${gridLayout === 'double' ? 'text-xs' : 'text-base'} leading-relaxed text-gray-700 whitespace-pre-line`}>
                          {page.content}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <div className={`page-number-preview ${gridLayout === 'double' ? 'text-xs w-5 h-5' : 'text-xs w-6 h-6'} bg-cyan-500 text-white rounded-full flex items-center justify-center font-semibold shadow-lg`}>
                      {page.id}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Image Management Tray */}
        <AnimatePresence>
          {showImageTray && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={closeImageTray}
              />

              {/* Slide-out Tray */}
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
                      onClick={closeImageTray}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Tabs */}
                  <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                    <button
                      onClick={() => setImageTrayTab('recent')}
                      className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                        imageTrayTab === 'recent'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Recent
                    </button>
                    <button
                      onClick={() => setImageTrayTab('upload')}
                      className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                        imageTrayTab === 'upload'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload
                    </button>
                    <button
                      onClick={() => setImageTrayTab('ai')}
                      className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                        imageTrayTab === 'ai'
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
                  {imageTrayTab === 'recent' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {availableImages.map((imageUrl, index) => (
                          <div
                            key={index}
                            className="relative cursor-pointer group"
                            onClick={() => addImageFromTray(imageUrl)}
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

                  {imageTrayTab === 'upload' && (
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
                          onChange={handleFileUpload}
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
                                onClick={() => addImageFromTray(imageUrl)}
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

                  {imageTrayTab === 'ai' && (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">
                          Describe the image you want to generate
                        </label>
                        <Textarea
                          value={aiImagePrompt}
                          onChange={(e) => setAiImagePrompt(e.target.value)}
                          placeholder="A professional photo of a tropical beach with palm trees and crystal clear water..."
                          className="min-h-[100px] resize-none"
                        />
                        <Button
                          onClick={generateAIImage}
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
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
