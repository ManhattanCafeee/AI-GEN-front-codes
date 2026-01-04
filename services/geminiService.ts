
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

export const getAISubtasks = async (task: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Decompose the following complex task into 3-5 clear, actionable subtasks: "${task}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subtasks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of actionable subtasks"
          }
        },
        required: ["subtasks"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text.trim());
    return data as AIResponse;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return { subtasks: [] };
  }
};
