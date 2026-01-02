import { GoogleGenAI, Type } from "@google/genai";
import { DocumentItem, SimulationResponse } from "../types";

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const performVectorSearchSimulation = async (
  documents: DocumentItem[],
  query: string
): Promise<SimulationResponse> => {
  const ai = getAiClient();

  if (documents.length === 0) {
    return {
      results: [],
      visualization: [],
      explanation: "No documents to search.",
    };
  }

  const prompt = `
    You are a high-performance Vector Database Simulator (like FAISS).
    
    I have a list of documents (Knowledge Base) and a User Query.
    Your task is to:
    1. Analyze the semantic meaning of the query and each document.
    2. Assign a simulated 2D vector coordinate [x, y] (range -100 to 100) to each document and the query based on their semantic similarity. Similar items should be close together. Dissimilar items should be far apart.
    3. Calculate a similarity score (0.0 to 1.0) for each document against the query.
    4. Provide a brief technical explanation of how a vector index (like IVF or HNSW) would traverse this space.

    Documents:
    ${JSON.stringify(documents.map(d => ({ id: d.id, text: d.text })))}

    Query:
    "${query}"

    Return the output in strict JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          results: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                score: { type: Type.NUMBER, description: "Similarity score 0-1" },
                distance: { type: Type.NUMBER, description: "Simulated Euclidean distance" },
              },
            },
          },
          visualization: {
            type: Type.ARRAY,
            description: "Coordinates for all docs AND the query",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                isQuery: { type: Type.BOOLEAN },
              },
            },
          },
          explanation: { type: Type.STRING },
        },
      },
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("Empty response from AI");
  }

  try {
    return JSON.parse(responseText) as SimulationResponse;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Invalid JSON response from AI");
  }
};

export const generateSampleData = async (): Promise<DocumentItem[]> => {
  const ai = getAiClient();
  const prompt = "Generate 10 diverse short sentences that could serve as a knowledge base for a vector search demo. Include topics like technology, nature, food, and history. Return just a JSON array of strings.";
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  const texts = JSON.parse(response.text || "[]") as string[];
  return texts.map((text, i) => ({
    id: `doc-${Date.now()}-${i}`,
    text
  }));
};

export const generateSemanticQuery = async (documents: DocumentItem[]): Promise<string> => {
  const ai = getAiClient();
  if (documents.length === 0) return "";

  // Sample a few docs to avoid huge context if many docs
  const sampleDocs = documents.slice(0, 10).map(d => d.text);

  const prompt = `
    Based on the following knowledge base snippets, generate a single realistic user search query that would be relevant to find this content.
    Do not use quotes. Just the raw query text.

    Snippets:
    ${JSON.stringify(sampleDocs)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text?.trim() || "Example query";
};