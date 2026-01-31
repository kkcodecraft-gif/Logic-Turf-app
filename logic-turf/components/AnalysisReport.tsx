import React from 'react';
import { PredictionResult } from '../types';
import ReactMarkdown from 'react-markdown';

interface AnalysisReportProps {
  result: PredictionResult | null;
  onReset: () => void;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, onReset }) => {
  if (!result) return null;

  return (
    <div className="animate-fade-in bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-8 bg-gold-500 rounded-sm"></div>
          <h2 className="text-xl font-bold text-slate-100">Investment Report</h2>
        </div>
        <span className="text-xs text-slate-500 font-mono">{result.timestamp}</span>
      </div>
      
      <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
        <div className="prose prose-invert prose-gold max-w-none">
          {/* 
            Note: In a real production environment, we would use a proper Markdown renderer library.
            For this simplified structure, we display the text with whitespace preservation
            and basic styling simulation via CSS classes on the container.
           */}
           <div className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed">
             {/* Simple formatting for headers if raw text is returned */}
             {result.markdownContent.split('\n').map((line, i) => {
               if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-gold-400 mt-6 mb-4 border-b border-slate-700 pb-2">{line.replace('# ', '')}</h1>;
               if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-slate-100 mt-6 mb-3">{line.replace('## ', '')}</h2>;
               if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-slate-200 mt-4 mb-2">{line.replace('### ', '')}</h3>;
               if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="block font-bold text-gold-500 my-2">{line.replace(/\*\*/g, '')}</strong>;
               if (line.startsWith('- ')) return <li key={i} className="ml-4 text-slate-300">{line.replace('- ', '')}</li>;
               return <p key={i} className="mb-2">{line}</p>;
             })}
           </div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-4 border-t border-slate-700 flex justify-center">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors border border-slate-600"
        >
          新たなレースを分析する
        </button>
      </div>
    </div>
  );
};

export default AnalysisReport;
