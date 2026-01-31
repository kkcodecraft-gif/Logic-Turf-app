import React, { useState, useRef, useEffect } from 'react';
import { TrackBiasPattern } from '../types';
import { BIAS_DEFINITIONS } from '../constants';
import { ChevronDown, Check, Info } from 'lucide-react';

interface BiasSelectorProps {
  selected: TrackBiasPattern;
  onSelect: (pattern: TrackBiasPattern) => void;
}

const BiasSelector: React.FC<BiasSelectorProps> = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedDef = BIAS_DEFINITIONS.find(b => b.id === selected) || BIAS_DEFINITIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (id: TrackBiasPattern) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Step 2: トラックバイアス判定 (Environment)
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          デフォルトは「自動判定」です。ご自身で馬場状態を指定したい場合はリストから選択してください。
        </p>
      </div>

      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Trigger */}
        <button
          type="button" // Prevent form submission
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-slate-900 border border-slate-700 hover:border-slate-500 text-white rounded-lg px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50"
        >
          <div className="flex items-center gap-3">
            <span className={`font-bold ${selected === TrackBiasPattern.AUTO ? 'text-blue-400' : 'text-gold-400'}`}>
              {selectedDef.title}
            </span>
            {selectedDef.isBlindSpot && (
              <span className="bg-red-900/50 text-red-200 text-[10px] px-2 py-0.5 rounded border border-red-800">
                盲点
              </span>
            )}
          </div>
          <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto">
            {BIAS_DEFINITIONS.map((bias) => (
              <button
                key={bias.id}
                type="button" // Prevent form submission
                onClick={() => handleSelect(bias.id)}
                className="w-full text-left px-4 py-3 hover:bg-slate-800 border-b border-slate-800 last:border-0 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-white">
                    {bias.title}
                  </div>
                  <div className="text-xs text-slate-500 group-hover:text-slate-400 truncate max-w-[300px] md:max-w-md">
                    {bias.condition}
                  </div>
                </div>
                {selected === bias.id && (
                  <Check size={16} className="text-gold-500" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Details Card */}
      <div className={`
        rounded-lg p-5 border
        ${selected === TrackBiasPattern.AUTO 
          ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-blue-900/30' 
          : 'bg-slate-900 border-gold-900/20'
        }
      `}>
        <div className="flex items-start gap-3">
          <Info size={18} className={selected === TrackBiasPattern.AUTO ? 'text-blue-400' : 'text-gold-500'} />
          <div className="space-y-2">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                概要
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedDef.description}
              </p>
            </div>
            
            <div className="pt-2 border-t border-slate-700/50 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div>
                <span className="text-xs text-slate-500 mr-2">コンディション:</span>
                <span className="text-sm text-slate-300">{selectedDef.condition}</span>
              </div>
              <div>
                <span className={`text-xs mr-2 ${selected === TrackBiasPattern.AUTO ? 'text-blue-400' : 'text-emerald-500'}`}>
                   {selected === TrackBiasPattern.AUTO ? '特徴:' : '有利:'}
                </span>
                <span className="text-sm text-slate-300">{selectedDef.advantage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiasSelector;