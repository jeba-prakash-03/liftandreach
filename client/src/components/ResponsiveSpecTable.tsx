import React, { useState } from 'react';
import { SpecTable } from '../types';
import { Table, Check, Info } from 'lucide-react';

interface ResponsiveSpecTableProps {
  specTables?: SpecTable[] | null;
  notes?: string[] | null;
}

export const ResponsiveSpecTable: React.FC<ResponsiveSpecTableProps> = ({ specTables, notes }) => {
  if (!specTables || specTables.length === 0) {
    if (notes && notes.length > 0) {
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-6">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-3">
            <Info className="w-4 h-4 text-[#2F5FA8]" />
            <span>Technical Specifications & Operational Notes</span>
          </div>
          <ul className="space-y-2">
            {notes.map((note, idx) => (
              <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-[#E53935] font-bold mt-0.5">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="my-8 space-y-6">
      {specTables.map((table, tIdx) => (
        <div key={tIdx} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
          {table.title && (
            <div className="bg-slate-100/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-[#2F5FA8]" />
                <h4 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider">
                  {table.title}
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 italic">
                Scroll horizontally on mobile devices ↔
              </span>
            </div>
          )}

          {/* Table Container with Horizontal Scroll & Sticky First Column */}
          <div className="overflow-x-auto relative">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A2E4C] text-white">
                  {table.columns.map((col, cIdx) => (
                    <th
                      key={cIdx}
                      className={`py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap border-b border-slate-700 ${
                        cIdx === 0
                          ? 'sticky left-0 bg-[#1A2E4C] z-10 shadow-r border-r border-slate-700 font-bold'
                          : ''
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={`transition-colors hover:bg-blue-50/40 ${
                      rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td
                      className={`py-3 px-4 font-bold text-slate-800 whitespace-nowrap border-r border-slate-200 sticky left-0 z-10 shadow-r ${
                        rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      }`}
                    >
                      {row.label}
                    </td>
                    {row.values.map((val, vIdx) => (
                      <td key={vIdx} className="py-3 px-4 text-slate-600 whitespace-nowrap font-medium">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Free text notes below table */}
      {notes && notes.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-700" />
            <span>Engineering Notes & Customization Parameters</span>
          </div>
          <ul className="space-y-1.5">
            {notes.map((note, nIdx) => (
              <li key={nIdx} className="text-xs text-amber-900 flex items-start gap-2">
                <span className="text-[#E53935] font-bold">▸</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
