
export interface Position {
  x: number;
  y: number;
}

export interface TextShadow {
  color: string;
  offsetX: number;
  offsetY: number;
  blurRadius: number;
}

export interface TextOutline {
  enabled: boolean;
  color: string;
  width: number;
}

export type QuoteMarkStyle = 'simple' | 'ornate' | 'bold';

export interface QuoteMarkOptions {
  enabled: boolean;
  color: string;
  size: number; // as a percentage of canvas width
  opacity: number; // 0 to 1
  style: QuoteMarkStyle;
}

export interface TextOptions {
  fontFamily: string;
  fontSize: number; // as a percentage of canvas width
  color: string;
  textAlign: 'left' | 'center' | 'right';
  position: Position;
  textShadow: TextShadow;
  outline: TextOutline;
  padding: number; // as a percentage of canvas width
  quoteMarks: QuoteMarkOptions;
}

export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'corners';

export interface FrameOptions {
  enabled: boolean;
  width: number; // as a percentage of canvas width
  color: string;
  style: BorderStyle;
}

export interface ImageOptions {
  blur: number; // in pixels
}

export interface SeparatorLineOptions {
  enabled: boolean;
  color: string;
  width: number; // as a percentage of canvas width
  thickness: number; // in pixels
  offsetY: number; // percentage from canvas center
}

export interface DesignSuggestion extends Omit<TextOptions, 'padding' | 'outline' | 'quoteMarks'> {}

export interface Template {
  name: string;
  textOptions: TextOptions;
  frameOptions: FrameOptions;
  imageOptions: ImageOptions;
  separatorLineOptions: SeparatorLineOptions;
}