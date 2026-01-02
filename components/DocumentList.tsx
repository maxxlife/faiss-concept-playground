import React, { useState } from 'react';
import { DocumentItem } from '../types';
import { Trash2, Plus, Database, Sparkles } from 'lucide-react';

interface DocumentListProps {
  documents: DocumentItem[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onAdd, onRemove, onGenerate, isGenerating }) => {
  const [newDoc, setNewDoc] = useState('');

  const handleAdd = () => {
    if (newDoc.trim()) {
      onAdd(newDoc.trim());
      setNewDoc('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="flex flex-col h-full bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Database size={18} />
          Knowledge Base
        </h2>
        <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded text-slate-300">
          {documents.length} Docs
        </span>
      </div>

      <div className="p-4 space-y-3 bg-slate-800/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={newDoc}
            onChange={(e) => setNewDoc(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a text snippet..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!newDoc.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full text-xs flex items-center justify-center gap-2 py-2 border border-dashed border-slate-600 hover:border-blue-500 hover:text-blue-400 text-slate-400 rounded transition-all"
        >
          {isGenerating ? <span className="animate-spin">⏳</span> : <Sparkles size={14} />}
          Generate Sample Data with AI
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {documents.length === 0 ? (
          <div className="text-center text-slate-500 text-sm mt-10">
            No documents indexed. <br/> Add some or generate samples.
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="group flex items-start justify-between gap-3 p-3 bg-slate-800 rounded border border-slate-700 hover:border-slate-600 transition-colors">
              <p className="text-sm text-slate-300 line-clamp-2">{doc.text}</p>
              <button
                onClick={() => onRemove(doc.id)}
                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentList;