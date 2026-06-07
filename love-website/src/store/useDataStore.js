import { create } from 'zustand';

export const DEFAULT_DATA = {
  styleTheme: 'classic',
  gridStyle: 'circular',
  hero: {
    name: 'Evelyn',
  },
  reasons: [
    "The way your eyes light up when you talk about something you love",
    "Your laugh, the one that makes the whole room feel warmer instantly",
    "How you make the most ordinary moments feel magical and rare",
    "Your strength, your softness, your endlessly beautiful heart",
    "The way home feels like wherever you happen to be",
    "Every quiet moment and every adventure, made perfect by you"
  ],
  letter: "My Love,\n\nThere are not enough words in this world to hold everything I feel for you. You walked into my life and rearranged everything, quietly, gently, until suddenly the world made sense in a way it never had before.\n\nYou are the person I reach for in the dark, the first thought I wake to, the reason I believe in beauty. Being loved by you is the greatest gift I have ever been given, and loving you, that is my greatest joy.\n\nForever and always, in every life, I would choose you.",
  memories: [
    { image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800', text: 'The First Date' },
    { image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800', text: 'A Walk in the Rain' },
    { image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800', text: 'Summer Sunsets' },
    { image: 'https://images.unsplash.com/photo-1501908731398-23592c872374?auto=format&fit=crop&q=80&w=800', text: 'Coffee Mornings' },
    { image: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&q=80&w=800', text: 'Stargazing Nights' },
    { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', text: 'Our Adventures' }
  ],
  promises: [
    "To always listen, even when the world is loud",
    "To be your safe place, your soft landing",
    "To hold your hand through every chapter",
    "To choose you, every single day"
  ],
  surprise: {
    message: "To the girl who holds my whole heart,\n\nI just wanted to remind you today, tomorrow, and every day after. You are my everything. Happy anniversary, my love.",
    songUrl: "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC", // From SpotifyPlayer
    videoUrl: "" // Secret video reveal
  },
  createdAt: null
};

const useDataStore = create((set) => ({
  data: DEFAULT_DATA,
  audioState: { isPlaying: false, volume: 0.5 },
  setData: (newData) => set({ data: newData }),
  setAudioState: (newState) => set((state) => ({ audioState: { ...state.audioState, ...newState } })),
}));

export default useDataStore;
