import React, { useState, useEffect } from 'react';
import { DocumentItem, SearchResult, VectorPoint } from './types';
import DocumentList from './components/DocumentList';
import SearchPanel from './components/SearchPanel';
import VectorPlot from './components/VectorPlot';
import { performVectorSearchSimulation, generateSampleData, generateSemanticQuery } from './services/gemini';
import { Layers, Activity, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [visualizationPoints, setVisualizationPoints] = useState<VectorPoint[]>([]);
  const [explanation, setExplanation] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial empty state or sample if desired? 
  // Let's leave it empty to force interaction.

  const handleAddDocument = (text: string) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      text,
    };
    setDocuments(prev => [...prev, newDoc]);
    // When adding docs, we invalidate previous visualization until search runs again
    // OR we could preserve them. Let's keep it simple: clear vis to show "index stale"
    if (visualizationPoints.length > 0) {
       // Ideally we'd keep points but mark them dirty. For now, let's just keep them
       // but new points won't appear until next search/re-index.
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    setVisualizationPoints(prev => prev.filter(p => p.id !== id));
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const handleGenerateSamples = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const samples = await generateSampleData();
      setDocuments(prev => [...prev, ...samples]);
    } catch (err) {
      setError("Failed to generate samples. Check API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAutoQuery = async (): Promise<string> => {
    if (documents.length === 0) {
      setError("Add documents to the Knowledge Base first.");
      return "";
    }
    setError(null);
    try {
      return await generateSemanticQuery(documents);
    } catch (err) {
      console.error(err);
      setError("Failed to generate query.");
      return "";
    }
  };

  const handleSearch = async (query: string) => {
    if (documents.length === 0) {
      setError("Add documents to the Knowledge Base first.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await performVectorSearchSimulation(documents, query);
      setResults(response.results);
      setVisualizationPoints(response.visualization);
      setExplanation(response.explanation);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Simulation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">FAISS <span className="text-slate-400 font-normal">Playground</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                <Activity size={14} className="text-green-500" />
                <span>Simulating gemini-3-flash</span>
             </div>
             <a href="https://github.com/facebookresearch/faiss" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
               Ref: facebookresearch/faiss
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 h-[calc(100vh-4rem)]">
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3 text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-4">
          
          {/* Left Column: Data Management */}
          <div className="lg:col-span-3 h-full min-h-[400px]">
            <DocumentList 
              documents={documents}
              onAdd={handleAddDocument}
              onRemove={handleRemoveDocument}
              onGenerate={handleGenerateSamples}
              isGenerating={isGenerating}
            />
          </div>

          {/* Middle Column: Visualization */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex-1 flex flex-col">
              <div className="mb-4 flex justify-between items-end">
                <div>
                  <h2 className="text-lg font-semibold text-slate-200">Vector Space</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Visualizing 2D projections of high-dimensional embeddings. 
                    <br/>
                    Closer points represent higher semantic similarity.
                  </p>
                </div>
              </div>
              
              <div className="flex-1 min-h-[300px]">
                <VectorPlot points={visualizationPoints} isLoading={isProcessing} />
              </div>
            </div>

            {/* Mini Stats / Legend */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700 text-center">
                 <div className="text-2xl font-bold text-slate-200">{documents.length}</div>
                 <div className="text-[10px] text-slate-400 uppercase tracking-wide">Vectors Indexed</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700 text-center">
                 <div className="text-2xl font-bold text-blue-400">1536</div>
                 <div className="text-[10px] text-slate-400 uppercase tracking-wide">Dimensions (Sim)</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700 text-center">
                 <div className="text-2xl font-bold text-emerald-400">L2</div>
                 <div className="text-[10px] text-slate-400 uppercase tracking-wide">Metric</div>
              </div>
            </div>
          </div>

          {/* Right Column: Search */}
          <div className="lg:col-span-4 h-full min-h-[400px]">
             <SearchPanel 
                onSearch={handleSearch}
                onGenerateQuery={handleAutoQuery}
                results={results}
                explanation={explanation}
                isSearching={isProcessing}
             />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;