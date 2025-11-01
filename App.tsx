import React, { useState, useCallback, useRef, useEffect } from 'react';
import ControlsPanel from './components/ControlsPanel';
import CanvasEditor from './components/CanvasEditor';
import { suggestDesign } from './services/geminiService';
import type { TextOptions, DesignSuggestion, FrameOptions, ImageOptions, SeparatorLineOptions, Template } from './types';

const INITIAL_TEXT_OPTIONS: TextOptions = {
  fontFamily: 'Playfair Display, serif',
  fontSize: 8,
  color: '#FFFFFF',
  textAlign: 'center',
  position: { x: 50, y: 50 },
  textShadow: { color: '#00000080', offsetX: 2, offsetY: 2, blurRadius: 4 },
  outline: { enabled: false, color: '#000000', width: 2 },
  padding: 5,
  quoteMarks: { enabled: true, color: '#FFFFFF', size: 20, opacity: 0.6, style: 'simple' },
};

const INITIAL_FRAME_OPTIONS: FrameOptions = {
    enabled: true,
    width: 1,
    color: '#FFFFFF',
    style: 'solid',
};

const INITIAL_IMAGE_OPTIONS: ImageOptions = {
    blur: 0,
};

const INITIAL_SEPARATOR_LINE_OPTIONS: SeparatorLineOptions = {
    enabled: true,
    color: '#FFFFFF',
    width: 30,
    thickness: 1,
    offsetY: 25,
};

const templates: Template[] = [
    {
        name: "Midnight Serenity",
        textOptions: {
            ...INITIAL_TEXT_OPTIONS,
            fontFamily: 'Playfair Display, serif',
            color: '#FFFFFF',
            textShadow: { color: '#000000', offsetX: 1, offsetY: 1, blurRadius: 3 },
            quoteMarks: { ...INITIAL_TEXT_OPTIONS.quoteMarks, enabled: true, size: 20, opacity: 0.7, style: 'simple' },
        },
        frameOptions: { ...INITIAL_FRAME_OPTIONS, enabled: false },
        imageOptions: { ...INITIAL_IMAGE_OPTIONS, blur: 0 },
        separatorLineOptions: { ...INITIAL_SEPARATOR_LINE_OPTIONS, enabled: true, offsetY: 30, width: 25, thickness: 1 },
    },
    {
        name: "Author's Touch",
        textOptions: {
            ...INITIAL_TEXT_OPTIONS,
            fontFamily: 'Georgia, serif',
            fontSize: 7,
            color: '#2d2d2d',
            textAlign: 'left',
            position: { x: 15, y: 50 },
            padding: 10,
            textShadow: { color: 'transparent', offsetX: 0, offsetY: 0, blurRadius: 0 },
            quoteMarks: { ...INITIAL_TEXT_OPTIONS.quoteMarks, enabled: false, style: 'simple' },
        },
        frameOptions: { ...INITIAL_FRAME_OPTIONS, enabled: false },
        imageOptions: { ...INITIAL_IMAGE_OPTIONS, blur: 0 },
        separatorLineOptions: { ...INITIAL_SEPARATOR_LINE_OPTIONS, enabled: true, color: '#2d2d2d', width: 15, offsetY: 20 },
    },
    {
        name: "Urban Explorer",
        textOptions: {
            ...INITIAL_TEXT_OPTIONS,
            fontFamily: 'Oswald, sans-serif',
            fontSize: 12,
            color: '#FFFFFF',
            textShadow: { color: '#000000', offsetX: 2, offsetY: 2, blurRadius: 3 },
            quoteMarks: { ...INITIAL_TEXT_OPTIONS.quoteMarks, enabled: false, style: 'bold' },
        },
        frameOptions: { ...INITIAL_FRAME_OPTIONS, enabled: true, style: 'corners', width: 1, color: '#FFFFFF' },
        imageOptions: { ...INITIAL_IMAGE_OPTIONS, blur: 1 },
        separatorLineOptions: { ...INITIAL_SEPARATOR_LINE_OPTIONS, enabled: false },
    },
    {
        name: "Minimalist Whisper",
        textOptions: {
            ...INITIAL_TEXT_OPTIONS,
            fontFamily: 'Lato, sans-serif',
            fontSize: 6,
            color: '#FFFFFF',
            position: { x: 50, y: 80 },
            textShadow: { color: 'transparent', offsetX: 0, offsetY: 0, blurRadius: 0 },
            quoteMarks: { ...INITIAL_TEXT_OPTIONS.quoteMarks, enabled: false, style: 'simple' },
        },
        frameOptions: { ...INITIAL_FRAME_OPTIONS, enabled: false },
        imageOptions: { ...INITIAL_IMAGE_OPTIONS, blur: 0 },
        separatorLineOptions: { ...INITIAL_SEPARATOR_LINE_OPTIONS, enabled: false },
    },
    {
        name: "Poetic Dream",
        textOptions: {
            ...INITIAL_TEXT_OPTIONS,
            fontFamily: 'Caveat, cursive',
            fontSize: 10,
            color: '#FFFFFF',
            textShadow: { color: '#00000080', offsetX: 1, offsetY: 1, blurRadius: 5 },
            quoteMarks: { ...INITIAL_TEXT_OPTIONS.quoteMarks, enabled: false, style: 'ornate' },
        },
        frameOptions: { ...INITIAL_FRAME_OPTIONS, enabled: false },
        imageOptions: { ...INITIAL_IMAGE_OPTIONS, blur: 2 },
        separatorLineOptions: { ...INITIAL_SEPARATOR_LINE_OPTIONS, enabled: false },
    },
];


const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const App: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState({ image: 0, quote: 0 });
  const [textOptions, setTextOptions] = useState<TextOptions>(INITIAL_TEXT_OPTIONS);
  const [frameOptions, setFrameOptions] = useState<FrameOptions>(INITIAL_FRAME_OPTIONS);
  const [imageOptions, setImageOptions] = useState<ImageOptions>(INITIAL_IMAGE_OPTIONS);
  const [separatorLineOptions, setSeparatorLineOptions] = useState<SeparatorLineOptions>(INITIAL_SEPARATOR_LINE_OPTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState(512);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const updateSize = () => {
          if (canvasContainerRef.current) {
              const { width, height } = canvasContainerRef.current.getBoundingClientRect();
              setCanvasSize(Math.min(width, height, 800));
          }
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleImageUpload = useCallback((files: File[]) => {
    const filePromises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(imageDataUrls => {
      setImages(prev => [...prev, ...imageDataUrls]);
    }).catch(err => {
        console.error(err);
        setError("Failed to load images.");
    });
  }, []);

  const handleQuoteUpload = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const loadedQuotes = text.split('\n').map(q => q.trim()).filter(Boolean);
      setQuotes(loadedQuotes);
      setCurrentIndex(prev => ({ ...prev, quote: 0 }));
    };
    reader.readAsText(file);
  }, []);

  const handleSuggestDesign = useCallback(async () => {
    const currentQuote = quotes[currentIndex.quote];
    if (!currentQuote) {
      setError("Please select a quote first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const suggestion: DesignSuggestion = await suggestDesign(currentQuote);
      setTextOptions(prev => ({...prev, ...suggestion }));
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [quotes, currentIndex.quote]);
  
  const handleDownload = () => {
      if(canvasRef.current) {
          const canvas = canvasRef.current;
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `quote-image-${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
      }
  };

  const handleApplyTemplate = (template: Template) => {
      setTextOptions(template.textOptions);
      setFrameOptions(template.frameOptions);
      setImageOptions(template.imageOptions);
      setSeparatorLineOptions(template.separatorLineOptions);
  };

  const currentImage = images.length > 0 ? images[currentIndex.image] : null;
  const currentQuote = quotes.length > 0 ? quotes[currentIndex.quote] : "Your quote will appear here.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 lg:p-8 bg-gray-900 font-sans">
      <header className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
            AI Quote Picture Maker
          </span>
        </h1>
        <p className="text-gray-400 mt-2">Create stunning, shareable quote images in seconds.</p>
      </header>
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-4 max-w-4xl w-full" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      <main className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
        <ControlsPanel
          onImageUpload={handleImageUpload}
          onQuoteUpload={handleQuoteUpload}
          onSuggestDesign={handleSuggestDesign}
          templates={templates}
          onApplyTemplate={handleApplyTemplate}
          isLoading={isLoading}
          textOptions={textOptions}
          setTextOptions={setTextOptions}
          frameOptions={frameOptions}
          setFrameOptions={setFrameOptions}
          imageOptions={imageOptions}
          setImageOptions={setImageOptions}
          separatorLineOptions={separatorLineOptions}
          setSeparatorLineOptions={setSeparatorLineOptions}
          imageCount={images.length}
          quoteCount={quotes.length}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
        <div ref={canvasContainerRef} className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg shadow-lg min-h-[300px] min-w-[300px]">
          <CanvasEditor
            ref={canvasRef}
            imageSrc={currentImage}
            quote={currentQuote}
            textOptions={textOptions}
            frameOptions={frameOptions}
            imageOptions={imageOptions}
            separatorLineOptions={separatorLineOptions}
            canvasSize={canvasSize}
          />
          <button
            onClick={handleDownload}
            disabled={!images.length}
            className="mt-6 flex items-center justify-center gap-2 w-full max-w-xs px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <DownloadIcon className="w-5 h-5"/>
            Download Image
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;