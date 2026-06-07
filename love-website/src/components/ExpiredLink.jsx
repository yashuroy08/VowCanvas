import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartBreak, PlusCircle, ArrowLeft } from '@phosphor-icons/react';

export default function ExpiredLink() {
  return (
    <main className="min-h-screen bg-rose-blush flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-md w-full bg-white/60 backdrop-blur-xl border border-white/80 p-12 rounded-[40px] shadow-2xl shadow-rose-deep/5 flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-rose-light-accent/30 rounded-full flex items-center justify-center mb-8">
          <HeartBreak size={40} weight="fill" className="text-rose-medium opacity-60" />
        </div>

        <h1 className="text-3xl font-bold text-rose-dark-accent mb-4 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          This link has expired
        </h1>
        
        <p className="text-rose-deep/50 mb-10 leading-relaxed">
          For privacy and security, digital letters and shared memories are automatically deleted 24 hours after they are created.
        </p>

        <div className="flex flex-col w-full gap-4">
          <Link to="/create" className="w-full">
            <button className="w-full bg-rose-deep text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 interactive-scale shadow-lg shadow-rose-deep/20">
              <PlusCircle size={20} weight="bold" />
              Create a New One
            </button>
          </Link>
          
          <Link to="/" className="w-full">
            <button className="w-full bg-white/40 border border-white/80 text-rose-deep/60 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 interactive-scale">
              <ArrowLeft size={18} weight="bold" />
              Back to Home
            </button>
          </Link>
        </div>
      </motion.div>

      <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-deep/30">
        Lovecraft Digital · Privacy First
      </p>
    </main>
  );
}
