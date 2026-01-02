export interface DocumentItem {
  id: string;
  text: string;
  category?: string;
}

export interface VectorPoint {
  id: string;
  x: number;
  y: number;
  text: string;
  isQuery?: boolean;
  score?: number; // Similarity score
}

export interface SearchResult {
  id: string;
  text: string;
  score: number;
  distance: number; // Simulated L2 distance or Cosine distance
}

export interface SimulationResponse {
  results: SearchResult[];
  visualization: VectorPoint[];
  explanation: string;
}

export enum IndexType {
  FLAT = 'IndexFlatL2',
  IVF = 'IndexIVFFlat',
}