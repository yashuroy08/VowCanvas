import React from 'react';
import { motion } from 'framer-motion';

const EMOJIS = ['🌸', '🌹', '🌷', '🤍', '🌷', '🌹', '🌸'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const emojiVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

export default function FlowerCrown() {
  return (
    <motion.div 
      className="flex justify-center gap-2 text-2xl select-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {EMOJIS.map((emoji, index) => (
        <motion.span key={index} variants={emojiVariants}>
          {emoji}
        </motion.span>
      ))}
    </motion.div>
  );
}
