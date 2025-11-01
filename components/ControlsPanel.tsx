import React from 'react';
import FileUploader from './FileUploader';
import type { TextOptions, FrameOptions, TextShadow, TextOutline, ImageOptions, BorderStyle, QuoteMarkOptions, SeparatorLineOptions, Template, QuoteMarkStyle } from '../types';

// Simple SVG Icons to avoid dependencies
const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const QuoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.125c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18.75m12.375-3.375H3.375m12.375 0L19.5 12m-16.125 0L5.25 6" />
  </svg>
);

const WandIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.25 15.75M9.75 3.104a2.25 2.25 0 00-2.25 2.25v4.5a2.25 2.25 0 004.5 0v-4.5a2.25 2.25 0 00-2.25-2.25M9.75 3.104C8.34 3.104 7.216 4.228 7.216 5.654v4.5a2.25 2.25 0 004.5 0v-4.5C11.716 4.228 10.66 3.104 9.75 3.104z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75l4.853 4.853a2.25 2.25 0 010 3.182l-2.25 2.25a2.25 2.25 0 01-3.182 0l-4.853-4.853" />
  </svg>
);

const googleFonts = [
    'Roboto, sans-serif',
    'Montserrat, sans-serif',
    'Lato, sans-serif',
    'Oswald, sans-serif',
    'Playfair Display, serif',
    'Lobster, cursive',
    'Caveat, cursive',
];
const defaultFonts = [
    'Georgia, serif',
    'Palatino Linotype, Book Antiqua, Palatino, serif',
    'Times New Roman, Times, serif',
    'Arial, Helvetica, sans-serif',
    'Verdana, Geneva, sans-serif',
    'Courier New, Courier, monospace',
    'Lucida Console, Monaco, monospace',
];
const allFonts = [...googleFonts, ...defaultFonts];
const borderStyles: { value: BorderStyle; label: string }[] = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'double', label: 'Double' },
    { value: 'groove', label: 'Groove' },
    { value: 'corners', label: 'Corners' },
];
const quoteMarkStyles: { value: QuoteMarkStyle; label: string }[] = [
    { value: 'simple', label: 'Simple' },
    { value: 'ornate', label: 'Ornate' },
    { value: 'bold', label: 'Bold' },
];

interface ControlsPanelProps {
  onImageUpload: (files: File[]) => void;
  onQuoteUpload: (files: File[]) => void;
  onSuggestDesign: () => void;
  templates: Template[];
  onApplyTemplate: (template: Template) => void;
  isLoading: boolean;
  textOptions: TextOptions;
  setTextOptions: React.Dispatch<React.SetStateAction<TextOptions>>;
  frameOptions: FrameOptions;
  setFrameOptions: React.Dispatch<React.SetStateAction<FrameOptions>>;
  imageOptions: ImageOptions;
  setImageOptions: React.Dispatch<React.SetStateAction<ImageOptions>>;
  separatorLineOptions: SeparatorLineOptions;
  setSeparatorLineOptions: React.Dispatch<React.SetStateAction<SeparatorLineOptions>>;
  imageCount: number;
  quoteCount: number;
  currentIndex: { image: number; quote: number };
  setCurrentIndex: React.Dispatch<React.SetStateAction<{ image: number; quote: number }>>;
}

const AccordionSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => (
    <details className="bg-gray-700/50 rounded-lg overflow-hidden group" open={defaultOpen}>
        <summary className="font-semibold text-gray-200 p-3 cursor-pointer hover:bg-gray-700 transition-colors list-none flex justify-between items-center">
            {title}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 transform transition-transform duration-200 group-open:rotate-90">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </summary>
        <div className="p-4 border-t border-gray-600 space-y-4">
            {children}
        </div>
    </details>
);

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  onImageUpload,
  onQuoteUpload,
  onSuggestDesign,
  templates,
  onApplyTemplate,
  isLoading,
  textOptions,
  setTextOptions,
  frameOptions,
  setFrameOptions,
  imageOptions,
  setImageOptions,
  separatorLineOptions,
  setSeparatorLineOptions,
  imageCount,
  quoteCount,
  currentIndex,
  setCurrentIndex,
}) => {
  const handleOptionChange = <K extends keyof TextOptions>(key: K, value: TextOptions[K]) => {
    setTextOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleFrameOptionChange = <K extends keyof FrameOptions>(key: K, value: FrameOptions[K]) => {
    setFrameOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const handleImageOptionChange = <K extends keyof ImageOptions>(key: K, value: ImageOptions[K]) => {
    setImageOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSeparatorLineOptionChange = <K extends keyof SeparatorLineOptions>(key: K, value: SeparatorLineOptions[K]) => {
    setSeparatorLineOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleTextShadowOptionChange = <K extends keyof TextShadow>(key: K, value: TextShadow[K]) => {
    setTextOptions(prev => ({
      ...prev,
      textShadow: {
        ...prev.textShadow,
        [key]: value
      }
    }));
  };

  const handleTextOutlineOptionChange = <K extends keyof TextOutline>(key: K, value: TextOutline[K]) => {
    setTextOptions(prev => ({
      ...prev,
      outline: {
        ...prev.outline,
        [key]: value
      }
    }));
  };

  const handleQuoteMarkOptionChange = <K extends keyof QuoteMarkOptions>(key: K, value: QuoteMarkOptions[K]) => {
    setTextOptions(prev => ({
        ...prev,
        quoteMarks: {
            ...prev.quoteMarks,
            [key]: value
        }
    }));
  };

  const handleNav = (type: 'image' | 'quote', dir: 'prev' | 'next') => {
      const count = type === 'image' ? imageCount : quoteCount;
      if (count <= 1) return;
      setCurrentIndex(prev => {
          const current = prev[type];
          const newIndex = dir === 'next' ? (current + 1) % count : (current - 1 + count) % count;
          return { ...prev, [type]: newIndex };
      });
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateName = e.target.value;
    if (!templateName) return;
    const selectedTemplate = templates.find(t => t.name === templateName);
    if (selectedTemplate) {
        onApplyTemplate(selectedTemplate);
    }
  };

  return (
    <div className="w-full lg:w-96 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-6 h-full overflow-y-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-teal-400">1. Add Content</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <FileUploader label="Upload Images" accept="image/*" multiple onFilesSelected={onImageUpload} Icon={ImageIcon} />
          <FileUploader label="Upload Quotes (.txt)" accept=".txt" onFilesSelected={onQuoteUpload} Icon={QuoteIcon} />
        </div>
      </div>
      
      {(imageCount > 0 || quoteCount > 0) && (
        <div className="space-y-4">
            {imageCount > 1 && (
            <div className="flex items-center justify-between">
                <span className="font-semibold">Image:</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleNav('image', 'prev')} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition">Prev</button>
                    <span>{currentIndex.image + 1} / {imageCount}</span>
                    <button onClick={() => handleNav('image', 'next')} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition">Next</button>
                </div>
            </div>
            )}
            {quoteCount > 1 && (
            <div className="flex items-center justify-between">
                <span className="font-semibold">Quote:</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleNav('quote', 'prev')} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition">Prev</button>
                    <span>{currentIndex.quote + 1} / {quoteCount}</span>
                    <button onClick={() => handleNav('quote', 'next')} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition">Next</button>
                </div>
            </div>
            )}
        </div>
      )}
      
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-teal-400">2. Choose a Template</h2>
        <div className="flex flex-col">
            <select
                id="templateSelect"
                onChange={handleTemplateSelect}
                defaultValue=""
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
            <option value="">-- Apply a Preset Style --</option>
            {templates.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-teal-400">3. Get AI Suggestion</h2>
        <button
          onClick={onSuggestDesign}
          disabled={isLoading || !quoteCount}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-500 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>Thinking...</span>
            </>
          ) : (
            <>
              <WandIcon className="w-5 h-5" />
              <span>Suggest with AI</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-teal-400">4. Fine-Tune Manually</h2>
        
        <AccordionSection title="Text Styling" defaultOpen>
            <div className="flex flex-col">
              <label htmlFor="fontFamily" className="text-sm font-medium text-gray-300 mb-1">Font Family</label>
              <select id="fontFamily" value={textOptions.fontFamily} onChange={e => handleOptionChange('fontFamily', e.target.value)} className="w-full bg-gray-600 border border-gray-500 rounded-md p-2 text-sm">
                {allFonts.map(font => <option key={font} value={font}>{font.split(',')[0]}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="fontSize" className="text-sm font-medium text-gray-300 mb-1">Font Size: {textOptions.fontSize}%</label>
              <input id="fontSize" type="range" min="2" max="20" value={textOptions.fontSize} onChange={e => handleOptionChange('fontSize', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="fontColor" className="text-sm font-medium text-gray-300 mb-1">Font Color</label>
              <input id="fontColor" type="color" value={textOptions.color} onChange={e => handleOptionChange('color', e.target.value)} className="w-full h-10 p-1 bg-gray-600 border border-gray-500 rounded-md cursor-pointer"/>
            </div>
            <div className="flex flex-col">
              <label htmlFor="textAlign" className="text-sm font-medium text-gray-300 mb-1">Text Align</label>
              <select id="textAlign" value={textOptions.textAlign} onChange={e => handleOptionChange('textAlign', e.target.value as 'left' | 'center' | 'right')} className="w-full bg-gray-600 border border-gray-500 rounded-md p-2 text-sm">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="padding" className="text-sm font-medium text-gray-300 mb-1">Padding: {textOptions.padding}%</label>
              <input id="padding" type="range" min="0" max="25" value={textOptions.padding} onChange={e => handleOptionChange('padding', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
            </div>
        </AccordionSection>

        <AccordionSection title="Positioning">
            <div className="flex flex-col">
              <label htmlFor="positionX" className="text-sm font-medium text-gray-300 mb-1">Horizontal Position: {textOptions.position.x}%</label>
              <input id="positionX" type="range" min="0" max="100" value={textOptions.position.x} onChange={e => handleOptionChange('position', { ...textOptions.position, x: Number(e.target.value) })} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="positionY" className="text-sm font-medium text-gray-300 mb-1">Vertical Position: {textOptions.position.y}%</label>
              <input id="positionY" type="range" min="0" max="100" value={textOptions.position.y} onChange={e => handleOptionChange('position', { ...textOptions.position, y: Number(e.target.value) })} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
            </div>
        </AccordionSection>

        <AccordionSection title="Shadow & Outline">
            <div className="flex items-center gap-2">
                <input id="outlineEnabled" type="checkbox" checked={textOptions.outline.enabled} onChange={e => handleTextOutlineOptionChange('enabled', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                <label htmlFor="outlineEnabled" className="text-sm font-medium text-gray-300">Enable Outline</label>
            </div>
            {textOptions.outline.enabled && (
                <div className='space-y-4 pl-6 border-l-2 border-gray-600'>
                  <div className="flex flex-col">
                    <label htmlFor="outlineColor" className="text-sm font-medium text-gray-300 mb-1">Outline Color</label>
                    <input id="outlineColor" type="color" value={textOptions.outline.color} onChange={e => handleTextOutlineOptionChange('color', e.target.value)} className="w-full h-10 p-1 bg-gray-600 border border-gray-500 rounded-md cursor-pointer"/>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="outlineWidth" className="text-sm font-medium text-gray-300 mb-1">Outline Width: {textOptions.outline.width}px</label>
                    <input id="outlineWidth" type="range" min="1" max="10" value={textOptions.outline.width} onChange={e => handleTextOutlineOptionChange('width', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
            )}
            <hr className="border-gray-600 my-2" />
            <div className="flex flex-col">
              <label htmlFor="shadowColor" className="text-sm font-medium text-gray-300 mb-1">Shadow Color</label>
              <input id="shadowColor" type="color" value={textOptions.textShadow.color} onChange={e => handleTextShadowOptionChange('color', e.target.value)} className="w-full h-10 p-1 bg-gray-600 border border-gray-500 rounded-md cursor-pointer"/>
            </div>
            <div className="flex flex-col">
              <label htmlFor="shadowOffsetX" className="text-sm font-medium text-gray-300 mb-1">Shadow Offset X: {textOptions.textShadow.offsetX}px</label>
              <input id="shadowOffsetX" type="range" min="-10" max="10" value={textOptions.textShadow.offsetX} onChange={e => handleTextShadowOptionChange('offsetX', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
            </div>
             <div className="flex flex-col">
              <label htmlFor="shadowOffsetY" className="text-sm font-medium text-gray-300 mb-1">Shadow Offset Y: {textOptions.textShadow.offsetY}px</label>
              <input id="shadowOffsetY" type="range" min="-10" max="10" value={textOptions.textShadow.offsetY} onChange={e => handleTextShadowOptionChange('offsetY', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
            </div>
             <div className="flex flex-col">
              <label htmlFor="shadowBlur" className="text-sm font-medium text-gray-300 mb-1">Shadow Blur: {textOptions.textShadow.blurRadius}px</label>
              <input id="shadowBlur" type="range" min="0" max="20" value={textOptions.textShadow.blurRadius} onChange={e => handleTextShadowOptionChange('blurRadius', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
            </div>
        </AccordionSection>
        
        <AccordionSection title="Quote Marks">
            <div className="flex items-center gap-2">
                <input id="quoteMarksEnabled" type="checkbox" checked={textOptions.quoteMarks.enabled} onChange={e => handleQuoteMarkOptionChange('enabled', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                <label htmlFor="quoteMarksEnabled" className="text-sm font-medium text-gray-300">Enable Quote Marks</label>
            </div>
            {textOptions.quoteMarks.enabled && (
                <div className='space-y-4 pl-6 border-l-2 border-gray-600'>
                  <div className="flex flex-col">
                      <label htmlFor="quoteMarkStyle" className="text-sm font-medium text-gray-300 mb-1">Style</label>
                      <select id="quoteMarkStyle" value={textOptions.quoteMarks.style} onChange={e => handleQuoteMarkOptionChange('style', e.target.value as QuoteMarkStyle)} className="w-full bg-gray-600 border border-gray-500 rounded-md p-2 text-sm">
                        {quoteMarkStyles.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="quoteMarkColor" className="text-sm font-medium text-gray-300 mb-1">Color</label>
                    <input id="quoteMarkColor" type="color" value={textOptions.quoteMarks.color} onChange={e => handleQuoteMarkOptionChange('color', e.target.value)} className="w-full h-10 p-1 bg-gray-600 border border-gray-500 rounded-md cursor-pointer"/>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="quoteMarkSize" className="text-sm font-medium text-gray-300 mb-1">Size: {textOptions.quoteMarks.size}%</label>
                    <input id="quoteMarkSize" type="range" min="5" max="50" value={textOptions.quoteMarks.size} onChange={e => handleQuoteMarkOptionChange('size', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
                  </div>
                   <div className="flex flex-col">
                    <label htmlFor="quoteMarkOpacity" className="text-sm font-medium text-gray-300 mb-1">Opacity: {textOptions.quoteMarks.opacity}</label>
                    <input id="quoteMarkOpacity" type="range" min="0" max="1" step="0.1" value={textOptions.quoteMarks.opacity} onChange={e => handleQuoteMarkOptionChange('opacity', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
            )}
        </AccordionSection>

        <AccordionSection title="Frame">
            <div className="flex items-center gap-2">
                <input id="frameEnabled" type="checkbox" checked={frameOptions.enabled} onChange={e => handleFrameOptionChange('enabled', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                <label htmlFor="frameEnabled" className="text-sm font-medium text-gray-300">Enable Frame</label>
            </div>
            {frameOptions.enabled && (
                <div className='space-y-4 pl-6 border-l-2 border-gray-600'>
                  <div className="flex flex-col">
                      <label htmlFor="frameStyle" className="text-sm font-medium text-gray-300 mb-1">Style</label>
                      <select id="frameStyle" value={frameOptions.style} onChange={e => handleFrameOptionChange('style', e.target.value as BorderStyle)} className="w-full bg-gray-600 border border-gray-500 rounded-md p-2 text-sm">
                        {borderStyles.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="frameColor" className="text-sm font-medium text-gray-300 mb-1">Color</label>
                    <input id="frameColor" type="color" value={frameOptions.color} onChange={e => handleFrameOptionChange('color', e.target.value)} className="w-full h-10 p-1 bg-gray-600 border border-gray-500 rounded-md cursor-pointer"/>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="frameWidth" className="text-sm font-medium text-gray-300 mb-1">Width: {frameOptions.width}%</label>
                    <input id="frameWidth" type="range" min="0.1" max="5" step="0.1" value={frameOptions.width} onChange={e => handleFrameOptionChange('width', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
            )}
        </AccordionSection>

        <AccordionSection title="Separator Line">
            <div className="flex items-center gap-2">
                <input id="separatorEnabled" type="checkbox" checked={separatorLineOptions.enabled} onChange={e => handleSeparatorLineOptionChange('enabled', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                <label htmlFor="separatorEnabled" className="text-sm font-medium text-gray-300">Enable Separator Line</label>
            </div>
            {separatorLineOptions.enabled && (
                <div className='space-y-4 pl-6 border-l-2 border-gray-600'>
                  <div className="flex flex-col">
                    <label htmlFor="separatorColor" className="text-sm font-medium text-gray-300 mb-1">Color</label>
                    <input id="separatorColor" type="color" value={separatorLineOptions.color} onChange={e => handleSeparatorLineOptionChange('color', e.target.value)} className="w-full h-10 p-1 bg-gray-600 border border-gray-500 rounded-md cursor-pointer"/>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="separatorWidth" className="text-sm font-medium text-gray-300 mb-1">Width: {separatorLineOptions.width}%</label>
                    <input id="separatorWidth" type="range" min="5" max="100" value={separatorLineOptions.width} onChange={e => handleSeparatorLineOptionChange('width', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="separatorThickness" className="text-sm font-medium text-gray-300 mb-1">Thickness: {separatorLineOptions.thickness}px</label>
                    <input id="separatorThickness" type="range" min="1" max="10" value={separatorLineOptions.thickness} onChange={e => handleSeparatorLineOptionChange('thickness', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="separatorOffsetY" className="text-sm font-medium text-gray-300 mb-1">Vertical Offset: {separatorLineOptions.offsetY}%</label>
                    <input id="separatorOffsetY" type="range" min="-50" max="50" value={separatorLineOptions.offsetY} onChange={e => handleSeparatorLineOptionChange('offsetY', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
            )}
        </AccordionSection>

        <AccordionSection title="Image Effects">
            <div className="flex flex-col">
              <label htmlFor="imageBlur" className="text-sm font-medium text-gray-300 mb-1">Background Blur: {imageOptions.blur}px</label>
              <input id="imageBlur" type="range" min="0" max="20" value={imageOptions.blur} onChange={e => handleImageOptionChange('blur', Number(e.target.value))} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" />
            </div>
        </AccordionSection>

      </div>
    </div>
  );
};

export default ControlsPanel;
