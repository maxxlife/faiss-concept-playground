import React, { useState } from 'react';
import { SearchResult, IndexType } from '../types';
import { Search, Settings, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

interface SearchPanelProps {
  onSearch: (query: string) => void;
  onGenerateQuery: () => Promise<string>;
  results: SearchResult[];
  explanation: string;
  isSearching: boolean;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch, onGenerateQuery, results, explanation, isSearching }) => {
  const [query, setQuery] = useState('');
  const [indexType, setIndexType] = useState<IndexType>(IndexType.FLAT);
  const [isGeneratingQuery, setIsGeneratingQuery] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleAutoGenerate = async () => {
    setIsGeneratingQuery(true);
    try {
      const generated = await onGenerateQuery();
      if (generated) setQuery(generated);
    } catch (error) {
      console.error("Failed to generate query", error);
    } finally {
      setIsGeneratingQuery(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Search size={18} />
          Vector Search
        </h2>
      </div>

      <div className="p-4 border-b border-slate-700 bg-slate-800/30">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a semantic query..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 shadow-inner"
            />
            <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
            
            <button
              type="button"
              onClick={handleAutoGenerate}
              disabled={isGeneratingQuery}
              className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-md transition-colors"
              title="Generate a query with AI based on your data"
            >
              {isGeneratingQuery ? (
                <Loader2 size={16} className="animate-spin text-purple-500" />
              ) : (
                <Sparkles size={16} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
             <Settings size={12} />
             <span>Index Type:</span>
             <select 
               value={indexType} 
               onChange={(e) => setIndexType(e.target.value as IndexType)}
               className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:outline-none"
             >
               <option value={IndexType.FLAT}>IndexFlatL2 (Exact)</option>
               <option value={IndexType.IVF}>IndexIVFFlat (Approximate)</option>
             </select>
          </div>

          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
          >
            {isSearching ? 'Searching Vector Space...' : 'Run Similarity Search'}
            {!isSearching && <ArrowRight size={16} />}
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {results.length > 0 ? (
          <>
             <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nearest Neighbors</h3>
              {results.map((result, idx) => (
                <div key={result.id} className="bg-slate-800 border border-slate-700 p-3 rounded-lg hover:border-blue-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-900/30 text-blue-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-blue-900/50">
                      Rank #{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Score: {(result.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">{result.text}</p>
                  <div className="mt-2 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${result.score * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {explanation && (
              <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-lg">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Engine Insight</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  {explanation}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
              <Search size={24} className="opacity-50" />
            </div>
            <p className="text-sm">Results will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;