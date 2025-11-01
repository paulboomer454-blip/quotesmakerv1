import React, { useRef, useEffect } from 'react';
import type { TextOptions, FrameOptions, ImageOptions, SeparatorLineOptions } from '../types';

interface CanvasEditorProps {
  imageSrc: string | null;
  quote: string | null;
  textOptions: TextOptions;
  frameOptions: FrameOptions;
  imageOptions: ImageOptions;
  separatorLineOptions: SeparatorLineOptions;
  canvasSize: number;
}

const shadeColor = (color: string, percent: number) => {
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = parseInt(String(R * (100 + percent) / 100));
    G = parseInt(String(G * (100 + percent) / 100));
    B = parseInt(String(B * (100 + percent) / 100));

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

const CanvasEditor: React.ForwardRefRenderFunction<HTMLCanvasElement, CanvasEditorProps> = ({ imageSrc, quote, textOptions, frameOptions, imageOptions, separatorLineOptions, canvasSize }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#111827'; // bg-gray-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawFrame = () => {
      if (!frameOptions.enabled || frameOptions.width <= 0) return;
    
      const frameWidth = (frameOptions.width / 100) * canvas.width;
      ctx.strokeStyle = frameOptions.color;
      
      // Reset from previous draws
      ctx.setLineDash([]);
      ctx.lineCap = 'butt';
    
      switch (frameOptions.style) {
        case 'dashed':
          ctx.lineWidth = frameWidth;
          ctx.setLineDash([frameWidth * 2, frameWidth * 1.5]);
          ctx.strokeRect(frameWidth / 2, frameWidth / 2, canvas.width - frameWidth, canvas.height - frameWidth);
          break;
    
        case 'dotted':
          ctx.lineWidth = frameWidth;
          ctx.setLineDash([1, frameWidth * 2]);
          ctx.lineCap = 'round';
          ctx.strokeRect(frameWidth / 2, frameWidth / 2, canvas.width - frameWidth, canvas.height - frameWidth);
          break;
    
        case 'double':
          const outerLineWidth = frameWidth * (2/5);
          const gap = frameWidth * (1/5);
          
          ctx.lineWidth = outerLineWidth;
          ctx.strokeRect(outerLineWidth / 2, outerLineWidth / 2, canvas.width - outerLineWidth, canvas.height - outerLineWidth);
          
          const offset = outerLineWidth + gap;
          ctx.strokeRect(offset + (outerLineWidth / 2), offset + (outerLineWidth / 2), canvas.width - (offset * 2) - outerLineWidth, canvas.height - (offset * 2) - outerLineWidth);
          break;

        case 'groove':
            const grooveWidth = frameWidth / 2;
            ctx.lineWidth = grooveWidth;
            
            const darkColor = shadeColor(frameOptions.color, -20);
            const lightColor = shadeColor(frameOptions.color, 20);
            
            ctx.strokeStyle = darkColor;
            ctx.strokeRect(grooveWidth / 2, grooveWidth / 2, canvas.width - grooveWidth, canvas.height - grooveWidth);
            
            ctx.strokeStyle = lightColor;
            ctx.strokeRect((grooveWidth / 2) + grooveWidth, (grooveWidth / 2) + grooveWidth, canvas.width - (grooveWidth * 3), canvas.height - (grooveWidth * 3));
            break;
            
        case 'corners':
            ctx.lineWidth = frameWidth;
            const cornerLength = canvas.width * 0.1;
            const cornerOffset = frameWidth / 2;

            ctx.beginPath();
            // Top-left
            ctx.moveTo(cornerOffset, cornerOffset + cornerLength);
            ctx.lineTo(cornerOffset, cornerOffset);
            ctx.lineTo(cornerOffset + cornerLength, cornerOffset);
            // Top-right
            ctx.moveTo(canvas.width - cornerOffset - cornerLength, cornerOffset);
            ctx.lineTo(canvas.width - cornerOffset, cornerOffset);
            ctx.lineTo(canvas.width - cornerOffset, cornerOffset + cornerLength);
            // Bottom-left
            ctx.moveTo(cornerOffset, canvas.height - cornerOffset - cornerLength);
            ctx.lineTo(cornerOffset, canvas.height - cornerOffset);
            ctx.lineTo(cornerOffset + cornerLength, canvas.height - cornerOffset);
            // Bottom-right
            ctx.moveTo(canvas.width - cornerOffset - cornerLength, canvas.height - cornerOffset);
            ctx.lineTo(canvas.width - cornerOffset, canvas.height - cornerOffset);
            ctx.lineTo(canvas.width - cornerOffset, canvas.height - cornerOffset - cornerLength);
            ctx.stroke();
            break;
    
        case 'solid':
        default:
          ctx.lineWidth = frameWidth;
          ctx.strokeRect(frameWidth / 2, frameWidth / 2, canvas.width - frameWidth, canvas.height - frameWidth);
          break;
      }
      
      // Cleanup
      ctx.setLineDash([]);
      ctx.lineCap = 'butt';
    };
    
    const drawQuoteMarks = () => {
        if (!textOptions.quoteMarks.enabled || !quote) return;
        const { color, size, opacity, style } = textOptions.quoteMarks;
        
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        
        const markSize = (size / 100) * canvas.width;
        
        switch (style) {
            case 'ornate':
                ctx.font = `italic bold ${markSize}px 'Lobster', cursive`;
                break;
            case 'bold':
                ctx.font = `italic 900 ${markSize}px 'Montserrat', sans-serif`;
                break;
            case 'simple':
            default:
                ctx.font = `italic bold ${markSize}px 'Playfair Display', serif`;
                break;
        }

        ctx.textAlign = 'center';
        
        const yPos = markSize * 0.8;
        ctx.fillText('“', canvas.width / 2, yPos);
        
        ctx.globalAlpha = 1.0;
    };
    
    const drawSeparatorLine = () => {
        if (!separatorLineOptions.enabled) return;
        const { color, width, thickness, offsetY } = separatorLineOptions;
        
        const lineWidth = (width / 100) * canvas.width;
        const lineY = (canvas.height / 2) + (offsetY / 100 * canvas.height);
        const lineStartX = (canvas.width - lineWidth) / 2;
        const lineEndX = lineStartX + lineWidth;

        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(lineStartX, lineY);
        ctx.lineTo(lineEndX, lineY);
        ctx.stroke();
    };


    const drawImage = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc!;
      img.onload = () => {
        // Crop to 1:1 aspect ratio from the center
        const { width, height } = img;
        const size = Math.min(width, height);
        const sx = (width - size) / 2;
        const sy = (height - size) / 2;
        
        // Apply blur
        if (imageOptions.blur > 0) {
          ctx.filter = `blur(${imageOptions.blur}px)`;
        }
        
        ctx.drawImage(img, sx, sy, size, size, 0, 0, canvas.width, canvas.height);

        // Reset blur so it doesn't affect text or frame
        ctx.filter = 'none';

        drawQuoteMarks();
        drawText();
        drawSeparatorLine();
        drawFrame();
      };
      img.onerror = () => {
        drawPlaceholder("Failed to load image");
        drawQuoteMarks();
        drawText();
        drawSeparatorLine();
        drawFrame();
      }
    };

    const drawPlaceholder = (text: string) => {
      ctx.fillStyle = '#374151'; // bg-gray-700
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#9CA3AF'; // text-gray-400
      ctx.textAlign = 'center';
      ctx.font = '20px sans-serif';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    };

    const drawText = () => {
      if (!quote) return;

      const { fontFamily, fontSize, color, textAlign, position, textShadow, outline, padding } = textOptions;
      
      const absoluteFontSize = (fontSize / 100) * canvas.width;
      ctx.font = `${absoluteFontSize}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = textAlign;

      // Apply shadow
      ctx.shadowColor = textShadow.color;
      ctx.shadowOffsetX = textShadow.offsetX;
      ctx.shadowOffsetY = textShadow.offsetY;
      ctx.shadowBlur = textShadow.blurRadius;

      const x = (position.x / 100) * canvas.width;
      const y = (position.y / 100) * canvas.height;
      
      const maxLineWidth = canvas.width - (canvas.width * (padding / 100) * 2);

      // Text wrapping logic
      const words = quote.split(' ');
      let line = '';
      let lines = [];
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxLineWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const lineHeight = absoluteFontSize * 1.2;
      let startY = y - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((l, index) => {
        const currentY = startY + index * lineHeight;
        // Draw outline if enabled
        if (outline.enabled && outline.width > 0) {
          ctx.strokeStyle = outline.color;
          ctx.lineWidth = outline.width;
          ctx.lineJoin = 'round'; // For smoother corners
          ctx.strokeText(l.trim(), x, currentY);
        }
        
        ctx.fillText(l.trim(), x, currentY);
      });

      // Reset shadow
      ctx.shadowColor = 'transparent';
    };

    if (imageSrc) {
      drawImage();
    } else {
      drawPlaceholder("Upload an Image");
      drawQuoteMarks();
      drawText();
      drawSeparatorLine();
      drawFrame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, quote, textOptions, frameOptions, imageOptions, separatorLineOptions, canvasSize, ref]);

  return <canvas ref={(ref as React.RefObject<HTMLCanvasElement>) || canvasRef} width={canvasSize} height={canvasSize} className="rounded-lg shadow-2xl" />;
};

export default React.forwardRef(CanvasEditor);