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

// Import our refactored components
import { TemplateType, ContentPage, GlobalTheme, ImageTrayTab } from '@/types';
import { TemplateRenderer, TemplateGallery } from '@/components/templates';
import { ImageLibrary } from '@/components/images';
import { analyzePageContent, getFilteredTemplatesForPage } from '@/utils/templateUtils';
import { addImageToPage, removeImageFromPage, createNewPage, duplicatePage, updatePageContent, deletePage } from '@/utils/pageUtils';
import { TEMPLATES } from '@/utils/constants';


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
  const [expandedPageForTemplates, setExpandedPageForTemplates] = useState<number | null>(null);
  const [activeThemeTab, setActiveThemeTab] = useState<'themes' | 'typography' | 'colors' | 'backgrounds'>('themes');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGradientFilter, setSelectedGradientFilter] = useState<string>('All');
  const [currentTheme, setCurrentTheme] = useState<GlobalTheme>({
    name: 'Corporate Blue',
    category: 'Business',
    description: 'Professional corporate design with trusted blue tones',
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
    coverBackground: {
      type: 'solid',
      value: '#1e293b'
    },
    banners: {
      enabled: false,
      color: '#06b6d4',
      opacity: 0.1
    },
    imageStyle: {
      borderRadius: '8px',
      borderWidth: '0px',
      borderColor: '#e2e8f0',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      bordersEnabled: false
    }
  });

  const predefinedThemes: GlobalTheme[] = [
    // BUSINESS & CORPORATE THEMES
    {
      name: 'Corporate Blue',
      category: 'Business',
      description: 'Professional corporate design with trusted blue tones',
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        h1Size: '2.5rem',
        h2Size: '1.5rem',
        bodySize: '1rem'
      },
      colors: {
        primary: '#1e40af',
        secondary: '#64748b',
        text: '#334155',
        background: '#ffffff',
        accent: '#06b6d4'
      },
      coverBackground: {
        type: 'solid',
        value: '#1e40af'
      },
      banners: {
        enabled: true,
        color: '#06b6d4',
        opacity: 0.15
      },
      imageStyle: {
        borderRadius: '8px',
        borderWidth: '0px',
        borderColor: '#e2e8f0',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        bordersEnabled: false
      }
    },
    {
      name: 'Executive Black',
      category: 'Business',
      description: 'Sophisticated executive presence with bold contrast',
      typography: {
        headingFont: 'Playfair Display',
        bodyFont: 'Source Sans Pro',
        h1Size: '3rem',
        h2Size: '1.75rem',
        bodySize: '1.1rem'
      },
      colors: {
        primary: '#000000',
        secondary: '#404040',
        text: '#2d3748',
        background: '#ffffff',
        accent: '#ffd700'
      },
      coverBackground: {
        type: 'solid',
        value: '#1a1a1a'
      },
      imageStyle: {
        borderRadius: '4px',
        borderWidth: '1px',
        borderColor: '#e5e7eb',
        shadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1)',
        bordersEnabled: false
      },
      banners: {
        enabled: false,
        color: '#ffd700',
        opacity: 0.1
      }
    },
    {
      name: 'Finance Gold',
      category: 'Business',
      description: 'Premium financial services with gold accents',
      typography: {
        headingFont: 'Merriweather',
        bodyFont: 'Open Sans',
        h1Size: '2.75rem',
        h2Size: '1.6rem',
        bodySize: '1rem'
      },
      colors: {
        primary: '#1a365d',
        secondary: '#4a5568',
        text: '#2d3748',
        background: '#fefefe',
        accent: '#d69e2e'
      },
      coverBackground: {
        type: 'solid',
        value: '#d69e2e'
      },
      imageStyle: {
        borderRadius: '12px',
        borderWidth: '2px',
        borderColor: '#d69e2e',
        shadow: '0 10px 15px -3px rgba(214, 158, 46, 0.1)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#d69e2e',
        opacity: 0.1
      }
    },
    {
      name: 'Legal Gray',
      category: 'Business',
      description: 'Authoritative legal professional styling',
      typography: {
        headingFont: 'Georgia',
        bodyFont: 'Times New Roman',
        h1Size: '2.5rem',
        h2Size: '1.5rem',
        bodySize: '1rem'
      },
      colors: {
        primary: '#2d3748',
        secondary: '#4a5568',
        text: '#1a202c',
        background: '#ffffff',
        accent: '#718096'
      },
      coverBackground: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradient: { from: '#667eea', to: '#764ba2', direction: '135deg' }
      },
      imageStyle: {
        borderRadius: '6px',
        borderWidth: '1px',
        borderColor: '#cbd5e0',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        bordersEnabled: false
      },
      banners: {
        enabled: false,
        color: '#ffd700',
        opacity: 0.1
      }
    },

    // CREATIVE & DESIGN THEMES
    {
      name: 'Creative Vibrant',
      category: 'Creative',
      description: 'Bold creative expression with vivid colors',
      typography: {
        headingFont: 'Montserrat',
        bodyFont: 'Lato',
        h1Size: '3.5rem',
        h2Size: '2rem',
        bodySize: '1.1rem'
      },
      colors: {
        primary: '#e53e3e',
        secondary: '#dd6b20',
        text: '#2d3748',
        background: '#fefefe',
        accent: '#9f7aea'
      },
      coverBackground: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        gradient: { from: '#ff9a9e', to: '#fecfef', direction: '135deg' }
      },
      imageStyle: {
        borderRadius: '20px',
        borderWidth: '3px',
        borderColor: '#e53e3e',
        shadow: '0 20px 25px -5px rgba(229, 62, 62, 0.1)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#e53e3e',
        opacity: 0.1
      }
    },
    {
      name: 'Artist Palette',
      category: 'Creative',
      description: 'Artistic freedom with painter-inspired colors',
      typography: {
        headingFont: 'Abril Fatface',
        bodyFont: 'Nunito',
        h1Size: '3.25rem',
        h2Size: '1.85rem',
        bodySize: '1.05rem'
      },
      colors: {
        primary: '#4c1d95',
        secondary: '#7c3aed',
        text: '#374151',
        background: '#faf5ff',
        accent: '#f59e0b'
      },
      coverBackground: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        gradient: { from: '#a8edea', to: '#fed6e3', direction: '135deg' }
      },
      imageStyle: {
        borderRadius: '25px',
        borderWidth: '4px',
        borderColor: '#4c1d95',
        shadow: '0 25px 50px -12px rgba(76, 29, 149, 0.25)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#4c1d95',
        opacity: 0.1
      }
    },
    {
      name: 'Designer Minimal',
      category: 'Creative',
      description: 'Clean design-focused minimalism',
      typography: {
        headingFont: 'Space Grotesk',
        bodyFont: 'Inter',
        h1Size: '2.75rem',
        h2Size: '1.6rem',
        bodySize: '1rem'
      },
      colors: {
        primary: '#1f2937',
        secondary: '#6b7280',
        text: '#374151',
        background: '#ffffff',
        accent: '#10b981'
      },
      coverBackground: {
        type: 'solid',
        value: '#f8fafc'
      },
      imageStyle: {
        borderRadius: '2px',
        borderWidth: '0px',
        borderColor: 'transparent',
        shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#10b981',
        opacity: 0.1
      }
    },

    // EDITORIAL & PUBLISHING
    {
      name: 'Magazine Clean',
      category: 'Editorial',
      description: 'Modern magazine layout with crisp typography',
      typography: {
        headingFont: 'Oswald',
        bodyFont: 'Source Sans Pro',
        h1Size: '3rem',
        h2Size: '1.75rem',
        bodySize: '1.05rem'
      },
      colors: {
        primary: '#1a202c',
        secondary: '#4a5568',
        text: '#2d3748',
        background: '#ffffff',
        accent: '#ed8936'
      },
      coverBackground: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        gradient: { from: '#ffecd2', to: '#fcb69f', direction: '135deg' }
      },
      imageStyle: {
        borderRadius: '8px',
        borderWidth: '0px',
        borderColor: 'transparent',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        bordersEnabled: false
      },
      banners: {
        enabled: false,
        color: '#ffd700',
        opacity: 0.1
      }
    },
    {
      name: 'Journal Elegant',
      category: 'Editorial',
      description: 'Sophisticated journal styling for thoughtful content',
      typography: {
        headingFont: 'Playfair Display',
        bodyFont: 'Crimson Text',
        h1Size: '2.5rem',
        h2Size: '1.5rem',
        bodySize: '1.1rem'
      },
      colors: {
        primary: '#553c9a',
        secondary: '#805ad5',
        text: '#2d3748',
        background: '#fffffe',
        accent: '#d69e2e'
      },
      coverBackground: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%)',
        gradient: { from: '#e0c3fc', to: '#9bb5ff', direction: '135deg' }
      },
      imageStyle: {
        borderRadius: '10px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#553c9a',
        opacity: 0.1
      }
    },

    // LUXURY & PREMIUM
    {
      name: 'Luxury Rose Gold',
      category: 'Luxury',
      description: 'Opulent rose gold luxury experience',
      typography: {
        headingFont: 'Cormorant Garamond',
        bodyFont: 'Libre Baskerville',
        h1Size: '3.5rem',
        h2Size: '2rem',
        bodySize: '1.1rem'
      },
      colors: {
        primary: '#744c2c',
        secondary: '#9c6644',
        text: '#2d3748',
        background: '#fffbf7',
        accent: '#e6a85c'
      },
      coverBackground: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        gradient: { from: '#ffecd2', to: '#fcb69f', direction: '135deg' }
      },
      imageStyle: {
        borderRadius: '15px',
        borderWidth: '2px',
        borderColor: '#e6a85c',
        shadow: '0 20px 25px -5px rgba(230, 168, 92, 0.1)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#e6a85c',
        opacity: 0.1
      }
    },
    {
      name: 'Premium Platinum',
      category: 'Luxury',
      description: 'Platinum-tier sophistication and elegance',
      typography: {
        headingFont: 'Didot',
        bodyFont: 'Avenir',
        h1Size: '3rem',
        h2Size: '1.75rem',
        bodySize: '1rem'
      },
      colors: {
        primary: '#2d3748',
        secondary: '#4a5568',
        text: '#1a202c',
        background: '#ffffff',
        accent: '#805ad5'
      },
      coverBackground: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradient: { from: '#667eea', to: '#764ba2', direction: '135deg' }
      },
      imageStyle: {
        borderRadius: '12px',
        borderWidth: '1px',
        borderColor: '#cbd5e0',
        shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#805ad5',
        opacity: 0.1
      }
    },

    // TECHNOLOGY & MODERN
    {
      name: 'Tech Gradient',
      category: 'Technology',
      description: 'Futuristic tech aesthetic with bold gradients',
      typography: {
        headingFont: 'JetBrains Mono',
        bodyFont: 'Inter',
        h1Size: '2.75rem',
        h2Size: '1.6rem',
        bodySize: '1rem'
      },
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        text: '#1f2937',
        background: '#f8fafc',
        accent: '#06b6d4'
      },
      coverBackground: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradient: { from: '#667eea', to: '#764ba2', direction: '135deg' }
      },
      imageStyle: {
        borderRadius: '16px',
        borderWidth: '0px',
        borderColor: 'transparent',
        shadow: '0 20px 25px -5px rgba(59, 130, 246, 0.1)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#06b6d4',
        opacity: 0.1
      }
    },
    {
      name: 'Startup Dynamic',
      category: 'Technology',
      description: 'High-energy startup vibe with bold colors',
      typography: {
        headingFont: 'Poppins',
        bodyFont: 'Inter',
        h1Size: '3.25rem',
        h2Size: '1.85rem',
        bodySize: '1.05rem'
      },
      colors: {
        primary: '#7c3aed',
        secondary: '#a855f7',
        text: '#374151',
        background: '#ffffff',
        accent: '#f59e0b'
      },
      coverBackground: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradient: { from: '#667eea', to: '#764ba2', direction: '135deg' }
      },
      imageStyle: {
        borderRadius: '20px',
        borderWidth: '0px',
        borderColor: 'transparent',
        shadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#7c3aed',
        opacity: 0.1
      }
    },

    // EDUCATION & HEALTHCARE
    {
      name: 'Education Friendly',
      category: 'Education',
      description: 'Approachable educational design with warm tones',
      typography: {
        headingFont: 'Quicksand',
        bodyFont: 'Open Sans',
        h1Size: '2.5rem',
        h2Size: '1.5rem',
        bodySize: '1.05rem'
      },
      colors: {
        primary: '#2b6cb0',
        secondary: '#4299e1',
        text: '#2d3748',
        background: '#ffffff',
        accent: '#ed8936'
      },
      coverBackground: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        gradient: { from: '#a8edea', to: '#fed6e3', direction: '135deg' }
      },
      imageStyle: {
        borderRadius: '12px',
        borderWidth: '2px',
        borderColor: '#4299e1',
        shadow: '0 10px 15px -3px rgba(66, 153, 225, 0.1)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#2b6cb0',
        opacity: 0.1
      }
    },
    {
      name: 'Healthcare Clean',
      category: 'Healthcare',
      description: 'Clean medical professional aesthetic',
      typography: {
        headingFont: 'Source Sans Pro',
        bodyFont: 'Lato',
        h1Size: '2.5rem',
        h2Size: '1.5rem',
        bodySize: '1rem'
      },
      colors: {
        primary: '#065f46',
        secondary: '#059669',
        text: '#374151',
        background: '#ffffff',
        accent: '#10b981'
      },
      coverBackground: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)',
        gradient: { from: '#a7f3d0', to: '#6ee7b7', direction: '135deg' }
      },
      imageStyle: {
        borderRadius: '8px',
        borderWidth: '1px',
        borderColor: '#d1fae5',
        shadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#065f46',
        opacity: 0.1
      }
    },

    // BOLD TYPOGRAPHY & DISTINCTIVE STYLES
    {
      name: 'Bold Impact',
      category: 'Creative',
      description: 'Ultra-bold typography for maximum visual impact',
      typography: {
        headingFont: 'Impact',
        bodyFont: 'Arial Black',
        h1Size: '4rem',
        h2Size: '2.5rem',
        bodySize: '1.2rem'
      },
      colors: {
        primary: '#000000',
        secondary: '#333333',
        text: '#1a1a1a',
        background: '#ffffff',
        accent: '#ff0000'
      },
      coverBackground: {
        type: 'solid',
        value: '#000000'
      },
      imageStyle: {
        borderRadius: '0px',
        borderWidth: '4px',
        borderColor: '#000000',
        shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#ff0000',
        opacity: 0.2
      }
    },
    {
      name: 'Fancy Script',
      category: 'Creative',
      description: 'Elegant script fonts with decorative flourishes',
      typography: {
        headingFont: 'Dancing Script',
        bodyFont: 'Libre Baskerville',
        h1Size: '4.5rem',
        h2Size: '2.8rem',
        bodySize: '1.15rem'
      },
      colors: {
        primary: '#2c1810',
        secondary: '#8b4513',
        text: '#3e2723',
        background: '#fefefe',
        accent: '#d4af37'
      },
      coverBackground: {
        type: 'solid',
        value: '#2c1810'
      },
      imageStyle: {
        borderRadius: '20px',
        borderWidth: '3px',
        borderColor: '#d4af37',
        shadow: '0 12px 24px rgba(212, 175, 55, 0.2)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#d4af37',
        opacity: 0.15
      }
    },
    {
      name: 'Doodle Fun',
      category: 'Creative',
      description: 'Playful handwritten style with whimsical elements',
      typography: {
        headingFont: 'Kalam',
        bodyFont: 'Comic Neue',
        h1Size: '3.5rem',
        h2Size: '2.2rem',
        bodySize: '1.1rem'
      },
      colors: {
        primary: '#6b46c1',
        secondary: '#ec4899',
        text: '#374151',
        background: '#fffbeb',
        accent: '#f59e0b'
      },
      coverBackground: {
        type: 'solid',
        value: '#fffbeb'
      },
      imageStyle: {
        borderRadius: '25px',
        borderWidth: '5px',
        borderColor: '#ec4899',
        shadow: '0 15px 35px rgba(236, 72, 153, 0.25)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#f59e0b',
        opacity: 0.2
      }
    },
    {
      name: 'Newspaper Bold',
      category: 'Editorial',
      description: 'Classic newspaper layout with strong headlines',
      typography: {
        headingFont: 'Times New Roman',
        bodyFont: 'Georgia',
        h1Size: '3.8rem',
        h2Size: '2.4rem',
        bodySize: '1.1rem'
      },
      colors: {
        primary: '#000000',
        secondary: '#404040',
        text: '#1a1a1a',
        background: '#ffffff',
        accent: '#c41e3a'
      },
      coverBackground: {
        type: 'solid',
        value: '#ffffff'
      },
      imageStyle: {
        borderRadius: '2px',
        borderWidth: '2px',
        borderColor: '#000000',
        shadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#c41e3a',
        opacity: 0.1
      }
    },
    {
      name: 'Modern Sans Ultra',
      category: 'Business',
      description: 'Ultra-modern sans serif with geometric precision',
      typography: {
        headingFont: 'Montserrat Black',
        bodyFont: 'Roboto',
        h1Size: '3.2rem',
        h2Size: '2rem',
        bodySize: '1.05rem'
      },
      colors: {
        primary: '#1f2937',
        secondary: '#4b5563',
        text: '#374151',
        background: '#ffffff',
        accent: '#3b82f6'
      },
      coverBackground: {
        type: 'solid',
        value: '#1f2937'
      },
      imageStyle: {
        borderRadius: '12px',
        borderWidth: '0px',
        borderColor: 'transparent',
        shadow: '0 20px 40px rgba(31, 41, 55, 0.15)',
        bordersEnabled: true
      },
      banners: {
        enabled: false,
        color: '#3b82f6',
        opacity: 0.1
      }
    },
    {
      name: 'Retro Typewriter',
      category: 'Editorial',
      description: 'Vintage typewriter aesthetic with monospace charm',
      typography: {
        headingFont: 'Courier New',
        bodyFont: 'Courier New',
        h1Size: '3rem',
        h2Size: '1.8rem',
        bodySize: '1rem'
      },
      colors: {
        primary: '#2d2d2d',
        secondary: '#555555',
        text: '#333333',
        background: '#f5f5dc',
        accent: '#8b4513'
      },
      coverBackground: {
        type: 'solid',
        value: '#f5f5dc'
      },
      imageStyle: {
        borderRadius: '4px',
        borderWidth: '3px',
        borderColor: '#2d2d2d',
        shadow: '0 6px 12px rgba(45, 45, 45, 0.2)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#8b4513',
        opacity: 0.15
      }
    },
    {
      name: 'Gothic Drama',
      category: 'Creative',
      description: 'Dramatic gothic styling with intense contrast',
      typography: {
        headingFont: 'Cinzel',
        bodyFont: 'Crimson Text',
        h1Size: '4rem',
        h2Size: '2.6rem',
        bodySize: '1.15rem'
      },
      colors: {
        primary: '#1a0000',
        secondary: '#4d0000',
        text: '#2d0000',
        background: '#fff8f8',
        accent: '#dc2626'
      },
      coverBackground: {
        type: 'solid',
        value: '#1a0000'
      },
      imageStyle: {
        borderRadius: '8px',
        borderWidth: '4px',
        borderColor: '#dc2626',
        shadow: '0 16px 32px rgba(220, 38, 38, 0.3)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#dc2626',
        opacity: 0.2
      }
    },
    {
      name: 'Chunky Display',
      category: 'Creative',
      description: 'Extra chunky display fonts for bold statements',
      typography: {
        headingFont: 'Fredoka One',
        bodyFont: 'Open Sans',
        h1Size: '4.5rem',
        h2Size: '2.8rem',
        bodySize: '1.1rem'
      },
      colors: {
        primary: '#7c2d12',
        secondary: '#ea580c',
        text: '#451a03',
        background: '#fffbeb',
        accent: '#f59e0b'
      },
      coverBackground: {
        type: 'solid',
        value: '#7c2d12'
      },
      imageStyle: {
        borderRadius: '16px',
        borderWidth: '6px',
        borderColor: '#ea580c',
        shadow: '0 20px 40px rgba(234, 88, 12, 0.25)',
        bordersEnabled: true
      },
      banners: {
        enabled: true,
        color: '#f59e0b',
        opacity: 0.2
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

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showImageTray) {
        closeImageTray();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showImageTray]);

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

  // Template categorization function
  const categorizeTemplate = (templateValue: TemplateType): 'text-only' | 'image-heavy' | 'mixed' => {
    const textOnlyTemplates = ['title', 'text-only', 'table-of-contents'];
    const imageHeavyTemplates = ['full-image', 'image-grid-2', 'image-grid-3', 'image-grid-4', 'image-grid-multi'];

    if (textOnlyTemplates.includes(templateValue)) return 'text-only';
    if (imageHeavyTemplates.includes(templateValue)) return 'image-heavy';
    return 'mixed'; // For mixed templates: text-image-right, text-image-left, image-top-text, text-top-image, hero-banner, color-block-left, color-block-top
  };

  // Page content analysis function - now returns exact image count for intelligent filtering
  const analyzePageContent = (page: ContentPage): { imageCount: number; hasImages: boolean } => {
    const imageCount = page.images.length;
    return { imageCount, hasImages: imageCount > 0 };
  };

  // Intelligent template filtering function - hides templates that don't make sense for the content
  const getFilteredTemplatesForPage = (page: ContentPage, templates: { value: TemplateType; label: string; category?: string }[]) => {
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

      let aScore = 0;
      let bScore = 0;

      if (imageCount > 0) {
        // Has images - prioritize image/mixed templates
        if (aCategory === 'image-heavy') aScore += 3;
        else if (aCategory === 'mixed') aScore += 2;
        else aScore += 1;

        if (bCategory === 'image-heavy') bScore += 3;
        else if (bCategory === 'mixed') bScore += 2;
        else bScore += 1;
      } else {
        // No images - prioritize text-only templates
        if (aCategory === 'text-only') aScore += 3;
        else if (aCategory === 'mixed') aScore += 2;
        else aScore += 1;

        if (bCategory === 'text-only') bScore += 3;
        else if (bCategory === 'mixed') bScore += 2;
        else bScore += 1;
      }

      return bScore - aScore;
    });
  };

  const templates: { value: TemplateType; label: string }[] = [
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

  // Render template content with actual page data
  const renderTemplateContent = (page: ContentPage, templateType: TemplateType, theme: GlobalTheme, isPreview: boolean = false) => {
    const scale = isPreview ? 0.8 : 1;
    const baseSize = isPreview ? '0.3rem' : '1rem';

    const commonStyles = {
      fontSize: baseSize,
      lineHeight: isPreview ? '1.2' : '1.6',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      width: `${100 / scale}%`,
      height: `${100 / scale}%`
    };

    switch (templateType) {
      case 'title':
        return (
          <div className="h-full flex flex-col justify-center items-center text-center p-2" style={commonStyles}>
            <h1 style={{ fontSize: isPreview ? '0.5rem' : '2rem', fontWeight: 'bold', marginBottom: isPreview ? '0.2rem' : '1rem', color: '#ffffff' }}>
              {page.title}
            </h1>
            <p style={{ fontSize: isPreview ? '0.25rem' : '1rem', color: '#ffffff', opacity: 0.9 }}>
              {page.content?.slice(0, 50) || 'Title page content...'}
            </p>
          </div>
        );

      case 'full-image':
        return (
          <div className="h-full relative" style={commonStyles}>
            {page.images.length > 0 ? (
              <img src={page.images[0]} alt="Full image" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <div style={{ fontSize: isPreview ? '0.4rem' : '2rem', fontWeight: 'bold', marginBottom: isPreview ? '0.1rem' : '0.5rem' }}>FULL IMAGE</div>
                  <div style={{ fontSize: isPreview ? '0.2rem' : '1rem', opacity: 0.8 }}>Background Layout</div>
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
              <h2 style={{ fontSize: isPreview ? '0.4rem' : '1.5rem', fontWeight: 'bold' }}>{page.title}</h2>
              {page.content && (
                <p style={{ fontSize: isPreview ? '0.25rem' : '1rem', opacity: 0.9 }}>
                  {page.content.slice(0, 60)}...
                </p>
              )}
            </div>
          </div>
        );

      case 'text-image-right':
        return (
          <div className="h-full flex gap-2 p-2" style={commonStyles}>
            <div className="flex-1">
              <h2 style={{ fontSize: isPreview ? '0.4rem' : '1.25rem', fontWeight: 'bold', marginBottom: isPreview ? '0.1rem' : '0.5rem' }}>
                {page.title}
              </h2>
              <p style={{ fontSize: isPreview ? '0.25rem' : '0.9rem' }}>
                {page.content || 'Page content will appear here...'}
              </p>
            </div>
            <div className="w-1/3">
              {page.images.length > 0 ? (
                <img src={page.images[0]} alt="Content" className="w-full h-full object-cover rounded" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 rounded flex items-center justify-center">
                  <span style={{ fontSize: isPreview ? '0.2rem' : '0.8rem', color: '#444', fontWeight: 'bold' }}>IMG</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'text-image-left':
        return (
          <div className="h-full flex gap-2 p-2" style={commonStyles}>
            <div className="w-1/3">
              {page.images.length > 0 ? (
                <img src={page.images[0]} alt="Content" className="w-full h-full object-cover rounded" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 rounded flex items-center justify-center">
                  <span style={{ fontSize: isPreview ? '0.2rem' : '0.8rem', color: '#444', fontWeight: 'bold' }}>IMG</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 style={{ fontSize: isPreview ? '0.4rem' : '1.25rem', fontWeight: 'bold', marginBottom: isPreview ? '0.1rem' : '0.5rem' }}>
                {page.title}
              </h2>
              <p style={{ fontSize: isPreview ? '0.25rem' : '0.9rem' }}>
                {page.content || 'Page content will appear here...'}
              </p>
            </div>
          </div>
        );

      case 'text-only':
        return (
          <div className="h-full p-2" style={commonStyles}>
            <h2 style={{ fontSize: isPreview ? '0.4rem' : '1.25rem', fontWeight: 'bold', marginBottom: isPreview ? '0.2rem' : '0.5rem' }}>
              {page.title}
            </h2>
            <p style={{ fontSize: isPreview ? '0.25rem' : '0.9rem', lineHeight: isPreview ? '1.2' : '1.6' }}>
              {page.content || 'This is a text-only layout. Your content will appear here with clean typography and optimal readability.'}
            </p>
          </div>
        );

      case 'image-grid-2':
        return (
          <div className="h-full p-1" style={commonStyles}>
            <h2 style={{ fontSize: isPreview ? '0.35rem' : '1.1rem', fontWeight: 'bold', textAlign: 'center', marginBottom: isPreview ? '0.1rem' : '0.5rem' }}>
              {page.title}
            </h2>
            <div className="flex-1 grid grid-cols-2 gap-1">
              {[0, 1].map((index) => (
                <div key={index}>
                  {page.images[index] ? (
                    <img src={page.images[index]} alt={`Image ${index + 1}`} className="w-full h-full object-cover rounded-sm" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 rounded-sm flex items-center justify-center">
                      <span style={{ fontSize: isPreview ? '0.2rem' : '0.8rem', color: '#065f46', fontWeight: 'bold' }}>{index + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'image-grid-3':
        return (
          <div className="h-full p-1" style={commonStyles}>
            <h2 style={{ fontSize: isPreview ? '0.35rem' : '1.1rem', fontWeight: 'bold', textAlign: 'center', marginBottom: isPreview ? '0.1rem' : '0.5rem' }}>
              {page.title}
            </h2>
            <div className="flex-1 grid grid-cols-2 gap-1">
              {[0, 1, 2].map((index) => (
                <div key={index} className={index === 2 ? 'col-span-2' : ''}>
                  {page.images[index] ? (
                    <img src={page.images[index]} alt={`Image ${index + 1}`} className="w-full h-full object-cover rounded-sm" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 rounded-sm flex items-center justify-center">
                      <span style={{ fontSize: isPreview ? '0.2rem' : '0.8rem', color: '#065f46', fontWeight: 'bold' }}>{index + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'image-grid-4':
        return (
          <div className="h-full p-1" style={commonStyles}>
            <h2 style={{ fontSize: isPreview ? '0.35rem' : '1.1rem', fontWeight: 'bold', textAlign: 'center', marginBottom: isPreview ? '0.1rem' : '0.5rem' }}>
              {page.title}
            </h2>
            <div className="flex-1 grid grid-cols-2 gap-1">
              {[0, 1, 2, 3].map((index) => (
                <div key={index}>
                  {page.images[index] ? (
                    <img src={page.images[index]} alt={`Image ${index + 1}`} className="w-full h-full object-cover rounded-sm" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 rounded-sm flex items-center justify-center">
                      <span style={{ fontSize: isPreview ? '0.2rem' : '0.8rem', color: '#065f46', fontWeight: 'bold' }}>{index + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'image-grid-multi':
        return (
          <div className="h-full p-1" style={commonStyles}>
            <h2 style={{ fontSize: isPreview ? '0.35rem' : '1.1rem', fontWeight: 'bold', textAlign: 'center', marginBottom: isPreview ? '0.1rem' : '0.5rem' }}>
              {page.title}
            </h2>
            <div className="flex-1 grid grid-cols-3 gap-1">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index}>
                  {page.images[index] ? (
                    <img src={page.images[index]} alt={`Image ${index + 1}`} className="w-full h-full object-cover rounded-sm" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 rounded-sm flex items-center justify-center">
                      <span style={{ fontSize: isPreview ? '0.15rem' : '0.7rem', color: '#065f46', fontWeight: 'bold' }}>{index + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'hero-banner':
        return (
          <div className="h-full relative overflow-hidden" style={commonStyles}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
            <div className="relative h-full flex flex-col justify-center items-center text-center p-2">
              <h1 style={{
                fontSize: isPreview ? '0.6rem' : '2.5rem',
                fontWeight: 'bold',
                marginBottom: isPreview ? '0.2rem' : '1rem',
                color: '#ffffff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {page.title}
              </h1>
              <p style={{
                fontSize: isPreview ? '0.3rem' : '1.2rem',
                color: '#ffffff',
                opacity: 0.9,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                {page.content?.slice(0, 80) || 'Epic hero banner content...'}
              </p>
            </div>
          </div>
        );

      case 'color-block-left':
        return (
          <div className="h-full flex" style={commonStyles}>
            <div className="w-1/3 bg-gradient-to-b from-indigo-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center p-1">
                <div style={{ fontSize: isPreview ? '0.2rem' : '0.8rem', fontWeight: 'bold' }}>SIDEBAR</div>
              </div>
            </div>
            <div className="flex-1 p-2 bg-white">
              <h2 style={{ fontSize: isPreview ? '0.4rem' : '1.25rem', fontWeight: 'bold', marginBottom: isPreview ? '0.1rem' : '0.5rem', color: '#333' }}>
                {page.title}
              </h2>
              <p style={{ fontSize: isPreview ? '0.25rem' : '0.9rem', color: '#666' }}>
                {page.content || 'Content with color sidebar layout...'}
              </p>
            </div>
          </div>
        );

      case 'color-block-top':
        return (
          <div className="h-full flex flex-col" style={commonStyles}>
            <div className="h-1/4 bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center">
              <div className="text-white text-center">
                <div style={{ fontSize: isPreview ? '0.25rem' : '1rem', fontWeight: 'bold' }}>HEADER</div>
              </div>
            </div>
            <div className="flex-1 p-2 bg-white">
              <h2 style={{ fontSize: isPreview ? '0.4rem' : '1.25rem', fontWeight: 'bold', marginBottom: isPreview ? '0.1rem' : '0.5rem', color: '#333' }}>
                {page.title}
              </h2>
              <p style={{ fontSize: isPreview ? '0.25rem' : '0.9rem', color: '#666' }}>
                {page.content || 'Content with color header layout...'}
              </p>
            </div>
          </div>
        );

      case 'image-top-text':
        return (
          <div className="h-full flex flex-col" style={commonStyles}>
            <div className="h-1/2">
              {page.images.length > 0 ? (
                <img src={page.images[0]} alt="Top image" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <span style={{ fontSize: isPreview ? '0.25rem' : '1rem', color: 'white', fontWeight: 'bold' }}>IMAGE</span>
                </div>
              )}
            </div>
            <div className="flex-1 p-2 bg-white">
              <h2 style={{ fontSize: isPreview ? '0.4rem' : '1.25rem', fontWeight: 'bold', marginBottom: isPreview ? '0.1rem' : '0.5rem', color: '#333' }}>
                {page.title}
              </h2>
              <p style={{ fontSize: isPreview ? '0.25rem' : '0.9rem', color: '#666' }}>
                {page.content || 'Text content below image...'}
              </p>
            </div>
          </div>
        );

      case 'text-top-image':
        return (
          <div className="h-full flex flex-col" style={commonStyles}>
            <div className="flex-1 p-2 bg-white">
              <h2 style={{ fontSize: isPreview ? '0.4rem' : '1.25rem', fontWeight: 'bold', marginBottom: isPreview ? '0.1rem' : '0.5rem', color: '#333' }}>
                {page.title}
              </h2>
              <p style={{ fontSize: isPreview ? '0.25rem' : '0.9rem', color: '#666' }}>
                {page.content || 'Text content above image...'}
              </p>
            </div>
            <div className="h-1/2">
              {page.images.length > 0 ? (
                <img src={page.images[0]} alt="Bottom image" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <span style={{ fontSize: isPreview ? '0.25rem' : '1rem', color: 'white', fontWeight: 'bold' }}>IMAGE</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full p-2 flex flex-col justify-center items-center" style={commonStyles}>
            <h2 style={{ fontSize: isPreview ? '0.4rem' : '1.25rem', fontWeight: 'bold', marginBottom: isPreview ? '0.1rem' : '0.5rem', textAlign: 'center' }}>
              {page.title}
            </h2>
            <p style={{ fontSize: isPreview ? '0.25rem' : '0.9rem', textAlign: 'center' }}>
              {page.content?.slice(0, 100) || 'Content preview...'}
            </p>
          </div>
        );
    }
  };

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

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => setShowThemeSettings(true)}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Palette className="w-4 h-4 mr-2" />
              Themes
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
        <motion.div
          ref={leftPanelRef}
          className="overflow-y-auto bg-background h-full"
          style={{ scrollBehavior: 'smooth' }}
          animate={{
            width: showThemeSettings ? '120px' : 'auto',
            opacity: showThemeSettings ? 0.3 : 1
          }}
          transition={{ type: "spring", damping: 30, stiffness: 300, duration: 0.4 }}
        >
          <div className={`${showThemeSettings ? 'p-2' : 'p-6'} space-y-6 max-w-4xl transition-all duration-300`}>

            {/* Pages Section */}
            <div className="space-y-4">
              {!showThemeSettings && <h3 className="text-lg font-semibold">Pages</h3>}
              {showThemeSettings && <h3 className="text-xs font-semibold text-center">Pages</h3>}
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
                      className={`page-card ${showThemeSettings ? 'p-2' : 'p-6'} cursor-pointer ${
                        selectedPage === page.id ? "selected" : ""
                      } transition-all duration-300`}
                      onClick={() => {
                        if (expandedPageForTemplates === page.id) {
                          setExpandedPageForTemplates(null);
                        } else {
                          scrollToPage(page.id);
                          setExpandedPageForTemplates(page.id);
                        }
                      }}
                    >
                      {showThemeSettings ? (
                        // Collapsed view - just page number
                        <div className="flex flex-col items-center">
                          <div className="page-number text-xs w-6 h-6 flex items-center justify-center">
                            {page.id}
                          </div>
                        </div>
                      ) : (
                        // Full view
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
                      )}
                    </Card>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

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
          className={`border-r border-border p-6 overflow-y-auto bg-background h-full ${
            showThemeSettings ? 'flex-shrink-0' : 'flex-1'
          }`}
          style={{ scrollBehavior: 'smooth' }}
          animate={{
            width: showThemeSettings ? 'calc(100vw - 120px - 480px - 4px)' : 'auto',
            opacity: showThemeSettings ? 1 : 1
          }}
          transition={{ type: "spring", damping: 30, stiffness: 300, duration: 0.4 }}
        >
          <div className="space-y-4">
            {gridLayout === 'double' ? (
              // Double column layout with proper row handling
              pages.reduce((rows: ContentPage[][], page, index) => {
                const rowIndex = Math.floor(index / 2);
                const positionInRow = index % 2;

                if (!rows[rowIndex]) {
                  rows[rowIndex] = [];
                }
                rows[rowIndex][positionInRow] = page;
                return rows;
              }, []).map((row: ContentPage[], rowIndex: number) => (
                <div key={`row-${rowIndex}`} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {row.map((page) => (
                      page && (
                        <motion.div
                          key={page.id}
                          data-preview-id={page.id}
                          className={`professional-preview cursor-pointer relative group ${
                            selectedPage === page.id ? "selected" : ""
                          }`}
                          onClick={() => {
                            scrollToPage(page.id);
                            // Toggle template expansion
                            setExpandedPageForTemplates(
                              expandedPageForTemplates === page.id ? null : page.id
                            );
                          }}
                          whileHover={{ scale: expandedPageForTemplates === page.id ? 0.95 : 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          layout
                          animate={{
                            scale: expandedPageForTemplates === page.id ? 0.85 : 1,
                          }}
                          transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        >
                          {/* Template Library Icon on Hover */}
                          <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-primary/90 backdrop-blur-sm text-white p-2 rounded-lg shadow-lg">
                              <LayoutTemplate className="w-4 h-4" />
                            </div>
                          </div>

                          <div
                            className={`preview-container text-black ${gridLayout === 'double' ? 'p-6 pt-10' : 'p-8 pt-12'} rounded-lg shadow-lg aspect-[3/4] relative overflow-hidden`}
                            style={{
                              background: page.template === 'title' ? currentTheme.coverBackground.value : currentTheme.colors.background,
                              fontFamily: currentTheme.typography.bodyFont,
                              color: page.template === 'title' ? '#ffffff' : 'inherit'
                            }}
                          >
                            {renderTemplateContent(page, page.template, currentTheme)}

                            <div className="absolute top-2 right-2">
                              <div className={`page-number-preview ${gridLayout === 'double' ? 'text-xs w-5 h-5' : 'text-xs w-6 h-6'} bg-cyan-500 text-white rounded-full flex items-center justify-center font-semibold shadow-lg`}>
                                {page.id}
                              </div>
                            </div>
                          </div>

                        </motion.div>
                      )
                    ))}
                  </div>

                  {/* Template Gallery Expansion - spans full width after this row */}
                  <AnimatePresence>
                    {row.some((page: ContentPage) => expandedPageForTemplates === page?.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, duration: 0.4 }}
                        className="overflow-hidden w-full"
                      >
                        <div className="p-6 bg-muted/30 border border-border rounded-lg relative">
                          {/* Close Button */}
                          <button
                            onClick={() => setExpandedPageForTemplates(null)}
                            className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm hover:bg-background text-foreground p-1.5 rounded-lg shadow-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="relative">
                            {/* Scroll Left Button */}
                            <button
                              onClick={() => {
                                const container = document.querySelector('.template-gallery-container');
                                if (container) {
                                  container.scrollBy({ left: -200, behavior: 'smooth' });
                                }
                              }}
                              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm hover:bg-background text-foreground p-2 rounded-lg shadow-lg transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Scroll Right Button */}
                            <button
                              onClick={() => {
                                const container = document.querySelector('.template-gallery-container');
                                if (container) {
                                  container.scrollBy({ left: 200, behavior: 'smooth' });
                                }
                              }}
                              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm hover:bg-background text-foreground p-2 rounded-lg shadow-lg transition-colors"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>


                            {/* Horizontal Scrollable Gallery */}
                            <div className="flex gap-6 overflow-x-auto px-12 py-2 template-gallery-container">
                              {(() => {
                                const currentPage = row.find((page: ContentPage) => expandedPageForTemplates === page?.id);
                                const filteredTemplates = currentPage ? getFilteredTemplatesForPage(currentPage, templates) : templates;
                                return filteredTemplates.map((template) => {
                                const isSelected = currentPage?.template === template.value;
                                return (
                                  <motion.div
                                    key={template.value}
                                    onClick={() => {
                                      if (currentPage) {
                                        updatePage(currentPage.id, { template: template.value });
                                      }
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
                                        {currentPage && renderTemplateContent(currentPage, template.value, currentTheme, true)}
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                                });
                              })()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              // Single column layout
              pages.map((page) => (
                <motion.div
                  key={page.id}
                  data-preview-id={page.id}
                  className={`professional-preview cursor-pointer ${
                    selectedPage === page.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    scrollToPage(page.id);
                    setExpandedPageForTemplates(
                      expandedPageForTemplates === page.id ? null : page.id
                    );
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  <div
                    className={`preview-container text-black p-8 pt-12 rounded-lg shadow-lg aspect-[3/4] relative overflow-hidden`}
                    style={{
                      background: page.template === 'title' ? currentTheme.coverBackground.value : currentTheme.colors.background,
                      fontFamily: currentTheme.typography.bodyFont,
                      color: page.template === 'title' ? '#ffffff' : 'inherit'
                    }}
                  >
                    {renderTemplateContent(page, page.template, currentTheme)}

                    <div className="absolute top-2 right-2">
                      <div className="page-number-preview text-xs w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center font-semibold shadow-lg">
                        {page.id}
                      </div>
                    </div>
                  </div>

                  {/* Template Gallery for single column */}
                  <AnimatePresence>
                    {expandedPageForTemplates === page.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, duration: 0.4 }}
                        className="overflow-hidden mt-4"
                      >
                        <div className="p-4 bg-muted/30 border border-border rounded-lg">
                          <h4 className="text-sm font-semibold mb-4 text-center">Choose Layout Template</h4>


                          <div className="flex gap-6 overflow-x-auto pb-2 template-gallery-container">
                            {getFilteredTemplatesForPage(page, templates).map((template) => {
                              const isSelected = page.template === template.value;
                              return (
                                <motion.div
                                  key={template.value}
                                  onClick={() => {
                                    updatePage(page.id, { template: template.value });
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
                                      {renderTemplateContent(page, template.value, currentTheme, true)}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Image Management Tray */}
        <AnimatePresence>
          {showImageTray && (
            <>

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

        {/* Premium Global Themes Panel - Professional Tabbed Interface */}
        <AnimatePresence>
          {showThemeSettings && (
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 400, duration: 0.3 }}
                className="fixed top-0 right-0 h-full w-[480px] bg-background border-l border-border z-50 shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-6 border-b border-border flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Premium Themes</h3>
                      <p className="text-sm text-muted-foreground">Professional styling for your ebook</p>
                    </div>
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

                {/* Tabs Navigation */}
                <div className="px-6 pt-4 border-b border-border flex-shrink-0">
                  <div className="flex space-x-1">
                    {[
                      { id: 'themes' as const, label: 'Themes', icon: '🎨' },
                      { id: 'typography' as const, label: 'Typography', icon: '📝' },
                      { id: 'colors' as const, label: 'Colors', icon: '🌈' },
                      { id: 'backgrounds' as const, label: 'Backgrounds', icon: '🖼️' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveThemeTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                          activeThemeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                  {/* THEMES TAB */}
                  {activeThemeTab === 'themes' && (
                    <div className="p-6 space-y-6">
                      {/* Category Filter */}
                      <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {['All', 'Business', 'Creative', 'Editorial', 'Luxury', 'Technology', 'Education', 'Healthcare'].map((category) => (
                            <button
                              key={category}
                              onClick={() => setSelectedCategory(category)}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                selectedCategory === category
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-primary/20'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>

                        {/* Gradient Filter */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Background Style</label>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {['All', 'Solid Colors', 'Gradients'].map((filter) => (
                              <button
                                key={filter}
                                onClick={() => setSelectedGradientFilter(filter)}
                                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                  selectedGradientFilter === filter
                                    ? 'bg-accent text-accent-foreground'
                                    : 'bg-muted/50 text-muted-foreground hover:bg-accent/20'
                                }`}
                              >
                                {filter}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Theme Grid */}
                      <div className="space-y-3">
                        {predefinedThemes
                          .filter(theme => selectedCategory === 'All' || theme.category === selectedCategory)
                          .filter(theme => {
                            if (selectedGradientFilter === 'All') return true;
                            if (selectedGradientFilter === 'Solid Colors') return theme.coverBackground.type === 'solid';
                            if (selectedGradientFilter === 'Gradients') return theme.coverBackground.type === 'gradient';
                            return true;
                          })
                          .map((theme) => (
                            <motion.div
                              key={theme.name}
                              onClick={() => setCurrentTheme(theme)}
                              className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                                currentTheme.name === theme.name
                                  ? 'border-primary bg-primary/10 shadow-lg'
                                  : 'border-border hover:border-primary/50 hover:shadow-md'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              layout
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-sm">{theme.name}</h4>
                                    <span className="px-2 py-0.5 text-xs bg-muted rounded-full">
                                      {theme.category}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-3">
                                    {theme.description}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                      <div
                                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                                        style={{ backgroundColor: theme.colors.primary }}
                                      />
                                      <div
                                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                                        style={{ backgroundColor: theme.colors.accent }}
                                      />
                                      <div
                                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                                        style={{ backgroundColor: theme.colors.secondary }}
                                      />
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {theme.typography.headingFont}
                                    </div>
                                  </div>
                                </div>
                                {currentTheme.name === theme.name && (
                                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* TYPOGRAPHY TAB */}
                  {activeThemeTab === 'typography' && (
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="font-semibold mb-4">Font Settings</h4>
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
                              className="mt-1"
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
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-4">Font Sizes</h4>
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
                              className="mt-1"
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
                              className="mt-1"
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
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COLORS TAB */}
                  {activeThemeTab === 'colors' && (
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="font-semibold mb-4">Color Palette</h4>
                        <div className="space-y-4">
                          {Object.entries(currentTheme.colors).map(([key, value]) => (
                            <div key={key}>
                              <label className="text-sm font-medium capitalize mb-2 block">{key.replace(/([A-Z])/g, ' $1')}</label>
                              <div className="flex gap-3">
                                <Input
                                  type="color"
                                  value={value}
                                  onChange={(e) => setCurrentTheme(prev => ({
                                    ...prev,
                                    colors: { ...prev.colors, [key]: e.target.value }
                                  }))}
                                  className="w-12 h-10 p-1 border cursor-pointer"
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
                    </div>
                  )}

                  {/* BACKGROUNDS TAB */}
                  {activeThemeTab === 'backgrounds' && (
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="font-semibold mb-4">Cover Page Background</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Background Type</label>
                            <div className="grid grid-cols-3 gap-2">
                              {['solid', 'gradient', 'pattern'].map((type) => (
                                <button
                                  key={type}
                                  onClick={() => setCurrentTheme(prev => ({
                                    ...prev,
                                    coverBackground: { ...prev.coverBackground, type: type as 'solid' | 'gradient' }
                                  }))}
                                  className={`p-2 text-sm rounded border ${
                                    currentTheme.coverBackground.type === type
                                      ? 'border-primary bg-primary/10'
                                      : 'border-border hover:bg-muted'
                                  }`}
                                >
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>

                          {currentTheme.coverBackground.type === 'gradient' && currentTheme.coverBackground.gradient && (
                            <div className="space-y-3">
                              <div>
                                <label className="text-sm font-medium">From Color</label>
                                <div className="flex gap-3 mt-1">
                                  <Input
                                    type="color"
                                    value={currentTheme.coverBackground.gradient.from}
                                    onChange={(e) => setCurrentTheme(prev => ({
                                      ...prev,
                                      coverBackground: {
                                        ...prev.coverBackground,
                                        gradient: prev.coverBackground.gradient ? {
                                          ...prev.coverBackground.gradient,
                                          from: e.target.value
                                        } : { from: e.target.value, to: '#000000', direction: '135deg' },
                                        value: `linear-gradient(${prev.coverBackground.gradient?.direction || '135deg'}, ${e.target.value} 0%, ${prev.coverBackground.gradient?.to || '#000000'} 100%)`
                                      }
                                    }))}
                                    className="w-12 h-10 p-1 border cursor-pointer"
                                  />
                                  <Input
                                    value={currentTheme.coverBackground.gradient.from}
                                    onChange={(e) => setCurrentTheme(prev => ({
                                      ...prev,
                                      coverBackground: {
                                        ...prev.coverBackground,
                                        gradient: prev.coverBackground.gradient ? {
                                          ...prev.coverBackground.gradient,
                                          from: e.target.value
                                        } : { from: e.target.value, to: '#000000', direction: '135deg' },
                                        value: `linear-gradient(${prev.coverBackground.gradient?.direction || '135deg'}, ${e.target.value} 0%, ${prev.coverBackground.gradient?.to || '#000000'} 100%)`
                                      }
                                    }))}
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">To Color</label>
                                <div className="flex gap-3 mt-1">
                                  <Input
                                    type="color"
                                    value={currentTheme.coverBackground.gradient.to}
                                    onChange={(e) => setCurrentTheme(prev => ({
                                      ...prev,
                                      coverBackground: {
                                        ...prev.coverBackground,
                                        gradient: prev.coverBackground.gradient ? {
                                          ...prev.coverBackground.gradient,
                                          to: e.target.value
                                        } : { from: '#000000', to: e.target.value, direction: '135deg' },
                                        value: `linear-gradient(${prev.coverBackground.gradient?.direction || '135deg'}, ${prev.coverBackground.gradient?.from || '#000000'} 0%, ${e.target.value} 100%)`
                                      }
                                    }))}
                                    className="w-12 h-10 p-1 border cursor-pointer"
                                  />
                                  <Input
                                    value={currentTheme.coverBackground.gradient.to}
                                    onChange={(e) => setCurrentTheme(prev => ({
                                      ...prev,
                                      coverBackground: {
                                        ...prev.coverBackground,
                                        gradient: prev.coverBackground.gradient ? {
                                          ...prev.coverBackground.gradient,
                                          to: e.target.value
                                        } : { from: '#000000', to: e.target.value, direction: '135deg' },
                                        value: `linear-gradient(${prev.coverBackground.gradient?.direction || '135deg'}, ${prev.coverBackground.gradient?.from || '#000000'} 0%, ${e.target.value} 100%)`
                                      }
                                    }))}
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-4">
                            <label className="text-sm font-medium mb-2 block">Preview</label>
                            <div
                              className="w-full h-20 rounded-lg border"
                              style={{
                                background: currentTheme.coverBackground.value
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border flex-shrink-0">
                  <Button
                    onClick={() => setShowThemeSettings(false)}
                    className="w-full bg-purple-gradient text-white h-12 text-base font-semibold"
                  >
                    ✨ Apply Premium Theme
                  </Button>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
