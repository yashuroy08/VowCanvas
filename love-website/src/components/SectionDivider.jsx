import React from 'react';

export default function SectionDivider({ label }) {
  return (
    <div className="flex items-center justify-center gap-4 py-8 select-none">
      <div className="w-[80px] h-[0.5px] bg-gradient-to-r from-transparent to-[#e8a0b0]" />
      <span className="font-lato text-[10px] tracking-[4px] uppercase text-rose-soft font-light">
        {label}
      </span>
      <div className="w-[80px] h-[0.5px] bg-gradient-to-l from-transparent to-[#e8a0b0]" />
    </div>
  );
}
