import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { VectorPoint } from '../types';

interface VectorPlotProps {
  points: VectorPoint[];
  isLoading: boolean;
}

const VectorPlot: React.FC<VectorPlotProps> = ({ points, isLoading }) => {
  // Separate query point from document points for different styling
  const queryPoint = points.find(p => p.isQuery);
  const docPoints = points.filter(p => !p.isQuery);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 p-3 rounded shadow-xl text-xs max-w-[200px]">
          <p className="font-bold text-slate-200 mb-1">{data.isQuery ? "QUERY" : "DOCUMENT"}</p>
          <p className="text-slate-300">{data.text}</p>
          <p className="text-slate-500 mt-2 font-mono">[{data.x.toFixed(1)}, {data.y.toFixed(1)}]</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] bg-slate-900 border border-slate-700 rounded-lg overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/80 z-10 flex items-center justify-center">
          <div className="text-blue-400 font-mono animate-pulse">Calculating Vectors...</div>
        </div>
      )}
      
      {points.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-slate-500">
          <p>Add documents and run a search to visualize vectors</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" name="X" hide domain={['auto', 'auto']} />
            <YAxis type="number" dataKey="y" name="Y" hide domain={['auto', 'auto']} />
            <ZAxis type="number" range={[100, 500]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            
            {/* Draw lines from query to top 3 nearest results if query exists */}
            {queryPoint && docPoints.slice(0, 3).map((target, i) => (
               <ReferenceLine 
                 key={i}
                 segment={[{ x: queryPoint.x, y: queryPoint.y }, { x: target.x, y: target.y }]} 
                 stroke="#3b82f6" 
                 strokeDasharray="3 3" 
                 opacity={0.5}
               />
            ))}

            <Scatter name="Documents" data={docPoints} fill="#94a3b8">
              {docPoints.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.score && entry.score > 0.8 ? '#4ade80' : '#94a3b8'} 
                />
              ))}
            </Scatter>
            
            {queryPoint && (
              <Scatter name="Query" data={[queryPoint]} fill="#ef4444" shape="star" />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      )}
      
      <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 bg-slate-900/50 p-1 rounded">
        PCA Reduced (Simulated 2D)
      </div>
    </div>
  );
};

export default VectorPlot;