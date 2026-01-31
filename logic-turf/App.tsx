import React, { useState } from 'react';
import { TrackBiasPattern, RaceInputData, PredictionResult } from './types';
import { analyzeRace } from './services/geminiService';
import BiasSelector from './components/BiasSelector';
import AnalysisReport from './components/AnalysisReport';
import { Trophy, TrendingUp, Search, Wallet, MapPin, Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [raceName, setRaceName] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState(3000);
  // Default to AUTO as requested
  const [biasPattern, setBiasPattern] = useState<TrackBiasPattern>(TrackBiasPattern.AUTO);
  const [notes, setNotes] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!raceName) {
      setError('レース名を入力してください');
      return;
    }
    // No need to check for UNKNOWN since default is AUTO

    setLoading(true);
    setError(null);

    try {
      const inputData: RaceInputData = {
        raceName,
        location,
        budget,
        biasPattern,
        additionalNotes: notes
      };

      const markdown = await analyzeRace(inputData);
      
      setResult({
        markdownContent: markdown,
        timestamp: new Date().toLocaleString('ja-JP'),
      });
    } catch (err) {
      setError('分析中にエラーが発生しました。時間を置いて再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setLoading(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-gold-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-1.5 rounded-lg shadow-lg shadow-gold-500/20">
              <Trophy size={20} className="text-slate-900" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Logic <span className="text-gold-500">Turf</span>
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-500 hidden sm:block">
            AI POWERED • PRO FRAMEWORK
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        
        {/* Intro */}
        {!result && !loading && (
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400">
              感情を排し、<span className="text-gold-500">論理</span>で勝つ。
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              究極の競馬予想フレームワークに基づき、AIがあなたの専属アナリストとして
              能力、バイアス、展開、血統を徹底分析します。
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-500 blur-xl opacity-20 rounded-full"></div>
              <Loader2 size={64} className="text-gold-500 animate-spin relative z-10" />
            </div>
            <h3 className="mt-8 text-xl font-bold text-slate-200">Analyzing Market...</h3>
            <p className="text-slate-500 mt-2">過去データのスクリーニングとバイアス適合性を計算中</p>
          </div>
        )}

        {/* Input Form */}
        {!result && !loading && (
          <form onSubmit={handleAnalyze} className="space-y-8 animate-slide-up">
            
            {/* Step 1: Basic Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Step 1: レース情報 (Target)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
                    <Search size={16} className="text-gold-500" /> レース名・R
                  </label>
                  <input
                    type="text"
                    value={raceName}
                    onChange={(e) => setRaceName(e.target.value)}
                    placeholder="例：有馬記念 / 東京11R"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
                    <MapPin size={16} className="text-gold-500" /> 場所（オプション）
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="例：中山競馬場"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Bias */}
            <BiasSelector selected={biasPattern} onSelect={setBiasPattern} />

            {/* Step 3: Capital & Notes */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Step 3: 資金戦略 & 補足 (Strategy)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
                    <Wallet size={16} className="text-gold-500" /> 投資予算
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-4 pr-10 py-3 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                    />
                    <span className="absolute right-4 top-3 text-slate-500">円</span>
                  </div>
                  <p className="text-xs text-slate-500">※推奨: 期待値最大化のため、傾斜配分を行います。</p>
                </div>
                <div className="space-y-2">
                   <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
                    <TrendingUp size={16} className="text-gold-500" /> 気になる馬・メモ
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="例：ルメールの馬が過剰人気気味..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg flex items-center gap-3">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-900 font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Trophy size={20} />
              分析を開始する
            </button>
            <p className="text-center text-xs text-slate-600">
              ※投資は自己責任で行ってください。本アプリは利益を保証するものではありません。<br/>
              ※AIはリアルタイムのオッズ変動を完全に予測することはできません。
            </p>
          </form>
        )}

        {/* Result View */}
        {result && (
          <AnalysisReport result={result} onReset={resetForm} />
        )}

      </main>
    </div>
  );
}

export default App;