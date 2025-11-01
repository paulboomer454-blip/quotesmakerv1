
import { GoogleGenAI, Type } from "@google/genai";
import type { DesignSuggestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema: any = {
  type: Type.OBJECT,
  properties: {
    fontFamily: {
      type: Type.STRING,
      description: "A beautiful, web-safe font family (e.g., 'Georgia, serif', 'Helvetica, sans-serif').",
    },
    fontSize: {
      type: Type.NUMBER,
      description: "A relative font size as a percentage of the canvas width (e.g., 8 for 8%). Value should be between 3 and 15.",
    },
    color: {
      type: Type.STRING,
      description: "A hex code for the text color for good contrast (e.g., '#FFFFFF').",
    },
    textAlign: {
      type: Type.STRING,
      description: "Text alignment: 'left', 'center', or 'right'.",
    },
    position: {
      type: Type.OBJECT,
      properties: {
        x: {
          type: Type.NUMBER,
          description: "X-coordinate percentage of the canvas width (e.g., 50 for center).",
        },
        y: {
          type: Type.NUMBER,
          description: "Y-coordinate percentage of the canvas height (e.g., 50 for center).",
        },
      },
      required: ["x", "y"],
    },
    textShadow: {
      type: Type.OBJECT,
      properties: {
        color: {
          type: Type.STRING,
          description: "Hex code for a subtle shadow color (e.g., '#000000').",
        },
        offsetX: {
          type: Type.NUMBER,
          description: "Shadow's horizontal offset in pixels.",
        },
        offsetY: {
          type: Type.NUMBER,
          description: "Shadow's vertical offset in pixels.",
        },
        blurRadius: {
          type: Type.NUMBER,
          description: "Shadow's blur radius in pixels.",
        },
      },
      required: ["color", "offsetX", "offsetY", "blurRadius"],
    },
  },
  required: ["fontFamily", "fontSize", "color", "textAlign", "position", "textShadow"],
};


export const suggestDesign = async (quote: string): Promise<DesignSuggestion> => {
  const prompt = `
You are a world-class graphic designer specializing in typography for social media. For the following quote, provide optimal design parameters to be placed on a background image. The output must be a single, valid JSON object that adheres to the provided schema.

Quote: "${quote}"

Generate a design that is visually appealing, modern, and ensures the text is highly readable. Consider common social media practices for quote images.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    
    // Basic validation
    if (result.textAlign && !['left', 'center', 'right'].includes(result.textAlign)) {
      result.textAlign = 'center';
    }

    return result as DesignSuggestion;
  } catch (error) {
    console.error("Error fetching design suggestion from Gemini:", error);
    throw new Error("Failed to get a design suggestion. Please try again.");
  }
};
