export default function SectionDivider({ label }) {
  return (
    <div className="flex items-center justify-center gap-4 py-12 select-none">
      <div className="w-[80px] h-[0.5px] bg-gradient-to-r from-transparent to-[#e8a0b0]" />
      <div className="flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-rose-soft/70 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="font-lato text-[10px] tracking-[5px] uppercase text-rose-soft font-light">
          {label}
        </span>
        <svg className="w-3.5 h-3.5 text-rose-soft/70 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <div className="w-[80px] h-[0.5px] bg-gradient-to-l from-transparent to-[#e8a0b0]" />
    </div>
  );
}
