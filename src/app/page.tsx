"use client";

import { useState, useRef, useCallback } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Wand2, Download, Image as ImageIcon, Trash2, Copy, MoreVertical, Expand, LayoutTemplate, Type, ImageIcon as ImageIconAlt, Grid3X3, Rows3, Send, X, Upload, Palette, Clock, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [showThemeSettings, setShowThemeSettings] = useState<boolean>(false);
  const [showTemplatePanel, setShowTemplatePanel] = useState<boolean>(false);
  const [selectedPageForTemplate, setSelectedPageForTemplate] = useState<number | null>(null);
  const [templateGalleryScroll, setTemplateGalleryScroll] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<GlobalTheme>({
    name: 'Professional',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      h1Size: '2.5rem',
      h2Size: '1.5rem',
      bodySize: '1rem'
    },
    colors: {
      primary: '#1e293b',
      secondary: '#64748b',
      text: '#334155',
      background: '#ffffff',
      accent: '#06b6d4'
    },
    imageStyle: {
      borderRadius: '8px',
      borderWidth: '0px',
      borderColor: '#e2e8f0',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }
  });

  const predefinedThemes: GlobalTheme[] = [
    {
      name: 'Professional',
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        h1Size: '2.5rem',
        h2Size: '1.5rem',
        bodySize: '1rem'
      },
      colors: {
        primary: '#1e293b',
        secondary: '#64748b',
        text: '#334155',
        background: '#ffffff',
        accent: '#06b6d4'
      },
      imageStyle: {
        borderRadius: '8px',
        borderWidth: '0px',
        borderColor: '#e2e8f0',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }
    },
    {
      name: 'Modern',
      typography: {
        headingFont: 'Poppins',
        bodyFont: 'Open Sans',
        h1Size: '3rem',
        h2Size: '1.75rem',
        bodySize: '1.1rem'
      },
      colors: {
        primary: '#7c3aed',
        secondary: '#a855f7',
        text: '#1f2937',
        background: '#fafbfc',
        accent: '#f59e0b'
      },
      imageStyle: {
        borderRadius: '16px',
        borderWidth: '2px',
        borderColor: '#e5e7eb',
        shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }
    },
    {
      name: 'Minimal',
      typography: {
        headingFont: 'Helvetica',
        bodyFont: 'Helvetica',
        h1Size: '2rem',
        h2Size: '1.25rem',
        bodySize: '0.95rem'
      },
      colors: {
        primary: '#000000',
        secondary: '#6b7280',
        text: '#374151',
        background: '#ffffff',
        accent: '#ef4444'
      },
      imageStyle: {
        borderRadius: '4px',
        borderWidth: '1px',
        borderColor: '#d1d5db',
        shadow: 'none'
      }
    }
  ];

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
                onClick={() => {
                  if (showTemplatePanel && selectedPageForTemplate === page.id) {
                    setShowTemplatePanel(false);
                    setSelectedPageForTemplate(null);
                  } else {
                    scrollToPage(page.id);
                    setSelectedPageForTemplate(page.id);
                    setShowTemplatePanel(true);
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <div
                  className={`preview-container text-black ${gridLayout === 'double' ? 'p-6 pt-10' : 'p-8 pt-12'} rounded-lg shadow-lg aspect-[3/4] relative overflow-hidden`}
                  style={{
                    backgroundColor: currentTheme.colors.background,
                    fontFamily: currentTheme.typography.bodyFont
                  }}
                >
                  {page.template === 'title' && (
                    <div className="h-full flex flex-col justify-center items-center text-center px-4">
                      <h1
                        className={`${gridLayout === 'double' ? 'text-lg' : 'text-3xl'} font-bold mb-4 leading-tight`}
                        style={{
                          fontSize: gridLayout === 'double' ? '1.1rem' : currentTheme.typography.h1Size,
                          fontFamily: currentTheme.typography.headingFont,
                          color: currentTheme.colors.primary
                        }}
                      >
                        {page.title}
                      </h1>
                      {page.subtitle && (
                        <p
                          className={`${gridLayout === 'double' ? 'text-xs' : 'text-lg'} mb-6`}
                          style={{
                            fontSize: gridLayout === 'double' ? '0.75rem' : currentTheme.typography.bodySize,
                            color: currentTheme.colors.secondary
                          }}
                        >
                          {page.subtitle}
                        </p>
                      )}
                      <div
                        className={`${gridLayout === 'double' ? 'text-xs' : 'text-base'} max-w-md leading-relaxed`}
                        style={{
                          fontSize: gridLayout === 'double' ? '0.7rem' : currentTheme.typography.bodySize,
                          color: currentTheme.colors.text
                        }}
                      >
                        {page.content}
                      </div>
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

        {/* Global Theme Settings Modal */}
        <AnimatePresence>
          {showThemeSettings && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setShowThemeSettings(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">Global Theme Settings</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowThemeSettings(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* Theme Presets */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Quick Themes</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {predefinedThemes.map((theme) => (
                          <div
                            key={theme.name}
                            onClick={() => setCurrentTheme(theme)}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              currentTheme.name === theme.name
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-sm font-medium mb-2">{theme.name}</div>
                              <div className="flex justify-center gap-1 mb-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: theme.colors.primary }}
                                />
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: theme.colors.accent }}
                                />
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: theme.colors.secondary }}
                                />
                              </div>
                              <div className="text-xs text-muted-foreground">{theme.typography.headingFont}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Typography Settings */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Typography</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Heading Font</label>
                            <Input
                              value={currentTheme.typography.headingFont}
                              onChange={(e) => setCurrentTheme(prev => ({
                                ...prev,
                                typography: { ...prev.typography, headingFont: e.target.value }
                              }))}
                              placeholder="Inter, Arial, sans-serif"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Body Font</label>
                            <Input
                              value={currentTheme.typography.bodyFont}
                              onChange={(e) => setCurrentTheme(prev => ({
                                ...prev,
                                typography: { ...prev.typography, bodyFont: e.target.value }
                              }))}
                              placeholder="Inter, Arial, sans-serif"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">H1 Size</label>
                            <Input
                              value={currentTheme.typography.h1Size}
                              onChange={(e) => setCurrentTheme(prev => ({
                                ...prev,
                                typography: { ...prev.typography, h1Size: e.target.value }
                              }))}
                              placeholder="2.5rem"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">H2 Size</label>
                            <Input
                              value={currentTheme.typography.h2Size}
                              onChange={(e) => setCurrentTheme(prev => ({
                                ...prev,
                                typography: { ...prev.typography, h2Size: e.target.value }
                              }))}
                              placeholder="1.5rem"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Body Size</label>
                            <Input
                              value={currentTheme.typography.bodySize}
                              onChange={(e) => setCurrentTheme(prev => ({
                                ...prev,
                                typography: { ...prev.typography, bodySize: e.target.value }
                              }))}
                              placeholder="1rem"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Color Settings */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Colors</h3>
                      <div className="grid grid-cols-3 gap-6">
                        {Object.entries(currentTheme.colors).map(([key, value]) => (
                          <div key={key}>
                            <label className="text-sm font-medium capitalize">{key}</label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                type="color"
                                value={value}
                                onChange={(e) => setCurrentTheme(prev => ({
                                  ...prev,
                                  colors: { ...prev.colors, [key]: e.target.value }
                                }))}
                                className="w-12 h-8 p-0 border cursor-pointer"
                              />
                              <Input
                                value={value}
                                onChange={(e) => setCurrentTheme(prev => ({
                                  ...prev,
                                  colors: { ...prev.colors, [key]: e.target.value }
                                }))}
                                placeholder="#000000"
                                className="flex-1"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Image Styling */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Image Styling</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Border Radius</label>
                            <Input
                              value={currentTheme.imageStyle.borderRadius}
                              onChange={(e) => setCurrentTheme(prev => ({
                                ...prev,
                                imageStyle: { ...prev.imageStyle, borderRadius: e.target.value }
                              }))}
                              placeholder="8px"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Border Width</label>
                            <Input
                              value={currentTheme.imageStyle.borderWidth}
                              onChange={(e) => setCurrentTheme(prev => ({
                                ...prev,
                                imageStyle: { ...prev.imageStyle, borderWidth: e.target.value }
                              }))}
                              placeholder="0px"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Border Color</label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={currentTheme.imageStyle.borderColor}
                                onChange={(e) => setCurrentTheme(prev => ({
                                  ...prev,
                                  imageStyle: { ...prev.imageStyle, borderColor: e.target.value }
                                }))}
                                className="w-12 h-8 p-0 border cursor-pointer"
                              />
                              <Input
                                value={currentTheme.imageStyle.borderColor}
                                onChange={(e) => setCurrentTheme(prev => ({
                                  ...prev,
                                  imageStyle: { ...prev.imageStyle, borderColor: e.target.value }
                                }))}
                                placeholder="#e2e8f0"
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Shadow</label>
                            <Input
                              value={currentTheme.imageStyle.shadow}
                              onChange={(e) => setCurrentTheme(prev => ({
                                ...prev,
                                imageStyle: { ...prev.imageStyle, shadow: e.target.value }
                              }))}
                              placeholder="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-border">
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowThemeSettings(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowThemeSettings(false)} className="bg-purple-gradient text-white">
                        Apply Theme
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Visual Template Customization Panel */}
        <AnimatePresence>
          {showTemplatePanel && selectedPageForTemplate && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '35%' }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 right-0 h-[65%] bg-background border-t border-l border-border z-40 shadow-2xl"
              style={{ width: rightPanelWidth }}
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-border flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Choose Layout Template</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowTemplatePanel(false);
                        setSelectedPageForTemplate(null);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Template Gallery */}
                <div className="flex-1 p-4">
                  <div className="text-sm font-medium mb-4">Choose Layout Template</div>

                  {/* Navigation and Gallery Container */}
                  <div className="relative">
                    {/* Left Arrow */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                      onClick={() => {
                        const container = document.querySelector('.template-gallery-container') as HTMLElement;
                        if (container) {
                          const scrollAmount = 200;
                          container.scrollLeft = Math.max(0, container.scrollLeft - scrollAmount);
                          setTemplateGalleryScroll(container.scrollLeft - scrollAmount);
                        }
                      }}
                      disabled={templateGalleryScroll <= 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {/* Right Arrow */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                      onClick={() => {
                        const container = document.querySelector('.template-gallery-container') as HTMLElement;
                        if (container) {
                          const scrollAmount = 200;
                          const maxScroll = container.scrollWidth - container.clientWidth;
                          container.scrollLeft = Math.min(maxScroll, container.scrollLeft + scrollAmount);
                          setTemplateGalleryScroll(container.scrollLeft + scrollAmount);
                        }
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    {/* Scrollable Template Gallery */}
                    <motion.div
                      className="template-gallery-container flex gap-4 overflow-x-auto scrollbar-hide py-2 px-8"
                      onScroll={(e) => {
                        const target = e.target as HTMLElement;
                        setTemplateGalleryScroll(target.scrollLeft);
                      }}
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                    {templates.map((template, index) => {
                      const currentPage = pages.find(p => p.id === selectedPageForTemplate);
                      const isSelected = currentPage?.template === template.value;

                      if (!currentPage) return null;

                      return (
                        <motion.div
                          key={template.value}
                          onClick={() => updatePage(currentPage.id, { template: template.value })}
                          className="cursor-pointer flex-shrink-0"
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            delay: 0.3 + (index * 0.1),
                            duration: 0.4,
                            type: "spring",
                            damping: 20,
                            stiffness: 300
                          }}
                          whileHover={{ y: -5 }}
                        >
                          <motion.div
                            className="w-56 h-48 bg-white border border-border rounded-lg overflow-hidden relative"
                            whileHover={{
                              scale: 1.05,
                              borderColor: currentTheme.colors.primary,
                              boxShadow: `0 8px 32px ${currentTheme.colors.primary}33`
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            animate={{
                              borderColor: isSelected ? currentTheme.colors.primary : 'transparent'
                            }}
                          >
                            <div
                              className="h-full p-2 text-black"
                              style={{
                                backgroundColor: currentTheme.colors.background,
                                fontFamily: currentTheme.typography.bodyFont,
                                fontSize: '0.5rem'
                              }}
                            >
                              {/* Title Template */}
                              {template.value === 'title' && (
                                <div className="h-full flex flex-col justify-center items-center text-center">
                                  <h1 style={{ fontSize: '0.6rem', fontFamily: currentTheme.typography.headingFont, color: currentTheme.colors.primary, fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                    {currentPage.title}
                                  </h1>
                                  <div style={{ fontSize: '0.4rem', color: currentTheme.colors.text }}>
                                    {currentPage.content.slice(0, 50)}...
                                  </div>
                                </div>
                              )}

                              {/* Text Image Right */}
                              {template.value === 'text-image-right' && (
                                <div className="h-full flex gap-1">
                                  <div className="flex-1">
                                    <h2 style={{ fontSize: '0.5rem', fontFamily: currentTheme.typography.headingFont, color: currentTheme.colors.primary, fontWeight: 'bold', marginBottom: '0.2rem' }}>
                                      {currentPage.title}
                                    </h2>
                                    <div style={{ fontSize: '0.35rem', color: currentTheme.colors.text, lineHeight: '1.2' }}>
                                      {currentPage.content.slice(0, 60)}...
                                    </div>
                                  </div>
                                  <div className="w-1/3">
                                    {currentPage.images.length > 0 ? (
                                      <img
                                        src={currentPage.images[0]}
                                        alt="preview"
                                        className="w-full h-12 object-cover"
                                        style={{ borderRadius: '2px' }}
                                      />
                                    ) : (
                                      <div className="w-full h-12 bg-gray-200 rounded flex items-center justify-center">
                                        <ImageIcon className="w-3 h-3 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Text Image Left */}
                              {template.value === 'text-image-left' && (
                                <div className="h-full flex gap-1">
                                  <div className="w-1/3">
                                    {currentPage.images.length > 0 ? (
                                      <img
                                        src={currentPage.images[0]}
                                        alt="preview"
                                        className="w-full h-12 object-cover"
                                        style={{ borderRadius: '2px' }}
                                      />
                                    ) : (
                                      <div className="w-full h-12 bg-gray-200 rounded flex items-center justify-center">
                                        <ImageIcon className="w-3 h-3 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h2 style={{ fontSize: '0.5rem', fontFamily: currentTheme.typography.headingFont, color: currentTheme.colors.primary, fontWeight: 'bold', marginBottom: '0.2rem' }}>
                                      {currentPage.title}
                                    </h2>
                                    <div style={{ fontSize: '0.35rem', color: currentTheme.colors.text, lineHeight: '1.2' }}>
                                      {currentPage.content.slice(0, 60)}...
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Image Top Text */}
                              {template.value === 'image-top-text' && (
                                <div className="h-full flex flex-col">
                                  <div className="h-1/2 mb-1">
                                    {currentPage.images.length > 0 ? (
                                      <img
                                        src={currentPage.images[0]}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                        style={{ borderRadius: '2px' }}
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                        <ImageIcon className="w-4 h-4 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h2 style={{ fontSize: '0.5rem', fontFamily: currentTheme.typography.headingFont, color: currentTheme.colors.primary, fontWeight: 'bold', marginBottom: '0.2rem' }}>
                                      {currentPage.title}
                                    </h2>
                                    <div style={{ fontSize: '0.35rem', color: currentTheme.colors.text, lineHeight: '1.2' }}>
                                      {currentPage.content.slice(0, 40)}...
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Text Top Image */}
                              {template.value === 'text-top-image' && (
                                <div className="h-full flex flex-col">
                                  <div className="flex-1 mb-1">
                                    <h2 style={{ fontSize: '0.5rem', fontFamily: currentTheme.typography.headingFont, color: currentTheme.colors.primary, fontWeight: 'bold', marginBottom: '0.2rem' }}>
                                      {currentPage.title}
                                    </h2>
                                    <div style={{ fontSize: '0.35rem', color: currentTheme.colors.text, lineHeight: '1.2' }}>
                                      {currentPage.content.slice(0, 40)}...
                                    </div>
                                  </div>
                                  <div className="h-1/2">
                                    {currentPage.images.length > 0 ? (
                                      <img
                                        src={currentPage.images[0]}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                        style={{ borderRadius: '2px' }}
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                        <ImageIcon className="w-4 h-4 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Text Only */}
                              {template.value === 'text-only' && (
                                <div className="h-full p-1">
                                  <h2 style={{ fontSize: '0.5rem', fontFamily: currentTheme.typography.headingFont, color: currentTheme.colors.primary, fontWeight: 'bold', marginBottom: '0.3rem' }}>
                                    {currentPage.title}
                                  </h2>
                                  <div style={{ fontSize: '0.35rem', color: currentTheme.colors.text, lineHeight: '1.3' }}>
                                    {currentPage.content.slice(0, 100)}...
                                  </div>
                                </div>
                              )}

                              {/* Table of Contents */}
                              {template.value === 'table-of-contents' && (
                                <div className="h-full p-1">
                                  <h2 style={{ fontSize: '0.5rem', fontFamily: currentTheme.typography.headingFont, color: currentTheme.colors.primary, fontWeight: 'bold', textAlign: 'center', marginBottom: '0.3rem' }}>
                                    {currentPage.title}
                                  </h2>
                                  <div className="bg-cyan-50 p-1 rounded" style={{ fontSize: '0.3rem', color: currentTheme.colors.text }}>
                                    {currentPage.content.slice(0, 80)}...
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
