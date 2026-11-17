import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APPLICATION_OPTIONS } from '../config/applications';
import { ArrowRight, Search } from 'lucide-react';

interface FinderProps {
  initialTask?: string;
  onTaskSelect?: (taskId: string) => void;
}

export const Finder: React.FC<FinderProps> = ({ initialTask, onTaskSelect }) => {
  const navigate = useNavigate();
  const [task, setTask] = useState(initialTask || '');
  const [load, setLoad] = useState('');
  const [height, setHeight] = useState('');

  // Sync if initialTask changes externally
  React.useEffect(() => {
    if (initialTask) setTask(initialTask);
  }, [initialTask]);

  // Calculate matching counts based on application mapping
  const matchCount = React.useMemo(() => {
    if (!task) return 16;
    const opt = APPLICATION_OPTIONS.find((o) => o.id === task);
    if (!opt) return 16;
    if (opt.categorySlugs.includes('scissor-lift')) return 12;
    if (opt.categorySlugs.includes('aerial-access-platform')) return 6;
    if (opt.categorySlugs.includes('goods-lift')) return 4;
    return 3;
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const opt = APPLICATION_OPTIONS.find((o) => o.id === task);
    const cat = opt?.categorySlugs[0] || '';

    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (load) params.set('load', load);
    if (height) params.set('height', height);

    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#D9E1EC] p-6 rounded-[4px] grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
        style={{
          boxShadow: 'var(--overlay-shadow)'
        }}
      >
        {/* Task Select */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#071A33]">
            What do you need to do?
          </label>
          <select
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
              if (onTaskSelect) onTaskSelect(e.target.value);
            }}
            className="w-full h-[48px] px-3.5 bg-[#F2F5F9] border border-[#D9E1EC] text-sm font-body text-[#0B1B33] rounded-[4px] focus:outline-hidden focus:border-[#0A4DA3] cursor-pointer"
          >
            <option value="">Select application...</option>
            {APPLICATION_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Load Input */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#071A33]">
            Load (kg or ton)
          </label>
          <input
            type="text"
            value={load}
            onChange={(e) => setLoad(e.target.value)}
            placeholder="e.g. 1000 kg or 2 ton"
            className="w-full h-[48px] px-3.5 bg-[#F2F5F9] border border-[#D9E1EC] text-sm font-body text-[#0B1B33] rounded-[4px] focus:outline-hidden focus:border-[#0A4DA3]"
          />
        </div>

        {/* Height Input */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#071A33]">
            Height (m)
          </label>
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 6 m"
            className="w-full h-[48px] px-3.5 bg-[#F2F5F9] border border-[#D9E1EC] text-sm font-body text-[#0B1B33] rounded-[4px] focus:outline-hidden focus:border-[#0A4DA3]"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-3">
          <button
            type="submit"
            className="w-full h-[48px] bg-[#E3262E] hover:bg-[#C91E25] active:scale-[0.98] text-white font-display uppercase tracking-[0.04em] text-sm font-bold flex items-center justify-center gap-2 rounded-[4px] transition-all cursor-pointer shadow-sm border-0"
          >
            <span>FIND EQUIPMENT</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </form>

      {/* Live Match Count */}
      <div className="mt-2.5 px-2 flex items-center justify-between text-xs font-mono text-[#5A6B82]">
        <span>
          <strong className="text-[#0A4DA3]">{matchCount}</strong> standard & custom models available
        </span>
        <span>Spec-driven parametric matching</span>
      </div>
    </div>
  );
};
