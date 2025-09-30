import React from 'react';
import { ContentPage, TemplateType, GlobalTheme } from '@/types';

interface TemplateRendererProps {
  page: ContentPage;
  templateType: TemplateType;
  theme: GlobalTheme;
  isPreview?: boolean;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  page,
  templateType,
  theme,
  isPreview = false
}) => {
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