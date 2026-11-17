import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getProducts } from '../services/api';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  ArrowRight,
  CheckCircle,
  Truck,
  Users,
  Building2,
  Package,
  Plane,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface FindMyLiftWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FindMyLiftWizard: React.FC<FindMyLiftWizardProps> = ({ isOpen, onClose }) => {
  const { openQuoteModal } = useApp();

  const [step, setStep] = useState(1);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [selectedLoad, setSelectedLoad] = useState<string>('');
  const [selectedHeight, setSelectedHeight] = useState<string>('');
  const [results, setResults] = useState<{ product: Product; reason: string }[]>([]);
  const [calculating, setCalculating] = useState(false);

  if (!isOpen) return null;

  const tasks = [
    { id: 'trucks', label: 'Loading & Unloading Trucks / Containers', icon: Truck, targetCategory: ['scissor-lift', 'dock-leveler', 'zero-lift'] },
    { id: 'people', label: 'Lifting People / Maintenance at Heights', icon: Users, targetCategory: ['aerial-access-platform', 'scissor-lift'] },
    { id: 'floors', label: 'Moving Materials Across Floors / Mezzanine', icon: Building2, targetCategory: ['goods-lift', 'scissor-lift'] },
    { id: 'drums', label: 'Handling & Dispensing Drums / Barrels', icon: Package, targetCategory: ['hydraulic-barrel-lifter-tilter'] },
    { id: 'pallets', label: 'Pallet Transport & Store Stacking', icon: Package, targetCategory: ['stacker', 'pallet-truck'] },
    { id: 'aircraft', label: 'Aircraft Landing Gear & Ground Support', icon: Plane, targetCategory: ['aircraft-jacks'] },
    { id: 'other', label: 'Other Heavy Machinery / Toolroom Die Handling', icon: SlidersHorizontal, targetCategory: ['hydraulic-floor-crane-light-duty', 'hollow-and-solid-ram-hydraulic-jack'] }
  ];

  const loads = [
    { id: 'light', label: 'Under 500 Kgs (Light Duty Components)' },
    { id: 'medium', label: '500 Kgs to 2,000 Kgs (Standard Pallet / Drums)' },
    { id: 'heavy', label: '2,000 Kgs to 10,000 Kgs (Containers & Heavy Steel)' },
    { id: 'extreme', label: 'Over 10,000 Kgs (Up to 25 Tons Custom)' }
  ];

  const heights = [
    { id: 'low', label: 'Under 2 Meters (Workstation, Dock Level, Die Loading)' },
    { id: 'mid', label: '2 Meters to 6 Meters (Mezzanine, Multi-Scissor)' },
    { id: 'high', label: '6 Meters to 16 Meters (High Travel Warehouses & Masts)' },
    { id: 'ultra', label: 'Up to 25 Meters (Building Facade & Street Lights)' }
  ];

  const handleCompute = async () => {
    setCalculating(true);
    try {
      const allProducts = await getProducts();
      const taskObj = tasks.find((t) => t.id === selectedTask);
      const targetCats = taskObj?.targetCategory || [];

      // Deterministic scoring based on real data
      const scored = allProducts
        .map((p) => {
          let score = 0;
          const catSlug = p.category?.parent?.slug || p.category?.slug || '';
          if (targetCats.includes(catSlug)) score += 50;

          const text = (p.name + ' ' + (p.description || '') + ' ' + JSON.stringify(p.applications || '')).toLowerCase();

          if (selectedTask === 'trucks' && (text.includes('truck') || text.includes('loading') || text.includes('dock'))) score += 30;
          if (selectedTask === 'people' && (text.includes('man lifting') || text.includes('heights') || text.includes('aerial'))) score += 30;
          if (selectedTask === 'floors' && (text.includes('floor') || text.includes('mezzanine') || text.includes('goods lift'))) score += 30;
          if (selectedTask === 'drums' && (text.includes('barrel') || text.includes('drum') || text.includes('tilter'))) score += 40;
          if (selectedTask === 'pallets' && (text.includes('stacker') || text.includes('pallet'))) score += 40;
          if (selectedTask === 'aircraft' && (text.includes('aircraft') || text.includes('jack'))) score += 40;

          // Load scoring
          if (selectedLoad === 'light' && (text.includes('300') || text.includes('500') || text.includes('light'))) score += 15;
          if (selectedLoad === 'medium' && (text.includes('1 ton') || text.includes('1000') || text.includes('2 ton') || text.includes('2000'))) score += 15;
          if (selectedLoad === 'heavy' && (text.includes('heavy') || text.includes('9000') || text.includes('10000') || text.includes('12000'))) score += 15;
          if (selectedLoad === 'extreme' && (text.includes('custom') || text.includes('25'))) score += 20;

          // Height scoring
          if (selectedHeight === 'low' && (text.includes('1500') || text.includes('900') || text.includes('pit') || text.includes('dock'))) score += 15;
          if (selectedHeight === 'mid' && (text.includes('6 meter') || text.includes('6000') || text.includes('3000'))) score += 15;
          if (selectedHeight === 'high' && (text.includes('10000') || text.includes('11000') || text.includes('13000') || text.includes('16000'))) score += 15;
          if (selectedHeight === 'ultra' && (text.includes('25') || text.includes('aerial') || text.includes('truck mounted'))) score += 20;

          let reason = `Recommended for ${taskObj?.label} based on application parameters and load ratings.`;
          return { product: p, score, reason };
        })
        .filter((item) => item.score > 40)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setResults(scored);
      setStep(4);
    } catch (e) {
      console.error(e);
    } finally {
      setCalculating(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedTask('');
    setSelectedLoad('');
    setSelectedHeight('');
    setResults([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Wizard Header */}
        <div className="bg-[#1A2E4C] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-[#E53935]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg">
                Find My Lift • Equipment Selector
              </h3>
              <p className="text-xs text-slate-300">
                Step {step} of 3 • Guided industrial recommendation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-6">
          {/* STEP 1: Application Purpose */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm text-slate-900">
                1. What is your primary material handling or lifting task?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tasks.map((task) => {
                  const Icon = task.icon;
                  const isSelected = selectedTask === task.id;
                  return (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task.id)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2F5FA8] bg-blue-50/70 text-[#2F5FA8] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-[#E53935]' : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold leading-tight">{task.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  disabled={!selectedTask}
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-[#2F5FA8] hover:bg-[#1F3F73] text-white font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer flex items-center gap-2"
                >
                  <span>Next: Capacity</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Load / Capacity */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm text-slate-900">
                2. What is your approximate operating load weight?
              </h4>
              <div className="space-y-2">
                {loads.map((load) => {
                  const isSelected = selectedLoad === load.id;
                  return (
                    <button
                      key={load.id}
                      onClick={() => setSelectedLoad(load.id)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2F5FA8] bg-blue-50/70 text-[#2F5FA8] shadow-xs font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white text-xs'
                      }`}
                    >
                      <span>{load.label}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-[#2F5FA8]" />}
                    </button>
                  );
                })}
              </div>
              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border rounded-xl text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  disabled={!selectedLoad}
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-[#2F5FA8] hover:bg-[#1F3F73] text-white font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer flex items-center gap-2"
                >
                  <span>Next: Elevation Height</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Elevation Height */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm text-slate-900">
                3. What lifting or working height do you require?
              </h4>
              <div className="space-y-2">
                {heights.map((ht) => {
                  const isSelected = selectedHeight === ht.id;
                  return (
                    <button
                      key={ht.id}
                      onClick={() => setSelectedHeight(ht.id)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2F5FA8] bg-blue-50/70 text-[#2F5FA8] shadow-xs font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white text-xs'
                      }`}
                    >
                      <span>{ht.label}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-[#2F5FA8]" />}
                    </button>
                  );
                })}
              </div>
              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border rounded-xl text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  disabled={!selectedHeight || calculating}
                  onClick={handleCompute}
                  className="px-6 py-2.5 bg-[#E53935] hover:bg-[#C62828] text-white font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer flex items-center gap-2 shadow"
                >
                  <span>{calculating ? 'Analyzing...' : 'View Matched Equipment'}</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: RESULTS */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    Recommended Equipment Solutions
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Ranked deterministically using certified catalog specs and operational duties.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-[#2F5FA8] hover:underline font-semibold"
                >
                  Start Over
                </button>
              </div>

              {results.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {results.map(({ product, reason }, i) => (
                    <div
                      key={product.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4"
                    >
                      <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 shrink-0 overflow-hidden">
                        <img
                          src={product.images?.[0] || '/images/product/scissor lift.jpg'}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#2F5FA8] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Match #{i + 1}
                          </span>
                          <h5 className="font-heading font-bold text-xs text-slate-900 truncate">
                            {product.name}
                          </h5>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{reason}</p>
                        <div className="pt-1 flex items-center gap-3 text-xs">
                          <Link
                            to={`/products/${product.category?.slug || 'equipment'}/${product.slug}`}
                            onClick={onClose}
                            className="font-bold text-[#2F5FA8] hover:underline"
                          >
                            View Specifications &rarr;
                          </Link>
                          <button
                            onClick={() => {
                              onClose();
                              openQuoteModal({ id: product.id, name: product.name, code: product.code });
                            }}
                            className="font-bold text-[#E53935] hover:underline"
                          >
                            Request Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-3 bg-amber-50/50 rounded-2xl p-6 border border-amber-200">
                  <HelpCircle className="w-10 h-10 text-amber-600 mx-auto" />
                  <h5 className="font-heading font-bold text-sm text-amber-950">
                    We Build Custom Units For Specialized Requirements!
                  </h5>
                  <p className="text-xs text-amber-900 max-w-md mx-auto leading-relaxed">
                    No standard catalog model strictly matches your extreme capacity or reach criteria, but our engineering team specializes in custom-built hydraulic scissor tables (up to 25 Tons / 12 Meters) and custom aerial access platforms (up to 25 Meters).
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      openQuoteModal({ id: 0, name: 'Bespoke Custom Hydraulic Unit' });
                    }}
                    className="px-6 py-2.5 bg-[#E53935] hover:bg-[#C62828] text-white font-bold text-xs rounded-xl shadow"
                  >
                    Contact Engineering For Custom Build
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
