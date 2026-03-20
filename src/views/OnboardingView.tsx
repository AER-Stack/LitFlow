import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const GENRES = [
  'Fiction', 'Non-fiction', 'Sci-Fi', 'Fantasy', 'Romance', 
  'Mystery', 'Thriller', 'Horror', 'Poetry', 'Biography',
  'History', 'Philosophy', 'Self-help', 'Classics'
];

export const OnboardingView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser, updateProfile } = useAppContext();
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateProfile({ bio, preferredGenres: selectedGenres });
      // Save onboarding state to local storage
      localStorage.setItem(`onboarding_${currentUser?.id}`, 'true');
      onComplete();
    } catch (err: any) {
      console.error('Error completing onboarding:', err);
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-ink text-cream rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <BookOpen size={40} />
              </div>
              <h1 className="text-4xl font-serif italic text-ink mb-4">Welcome to LitFlow</h1>
              <p className="text-ink/60 mb-12 text-lg">Your personal space for literary inspiration, beautiful quotes, and shared reading moments.</p>
              
              <button
                onClick={() => setStep(2)}
                className="w-full bg-ink text-cream py-4 rounded-2xl font-medium text-lg flex items-center justify-center space-x-2 hover:bg-ink/90 transition-colors"
              >
                <span>Let's get started</span>
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <h2 className="text-3xl font-serif italic text-ink mb-2">Tell us about yourself</h2>
              <p className="text-ink/60 mb-8">Add a short bio to your profile.</p>
              
              <div className="relative">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={160}
                  placeholder="I read to live, and I live to read..."
                  className="w-full bg-white border border-ink/10 rounded-2xl p-4 text-ink placeholder-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/20 resize-none h-32 mb-2"
                />
                <div className="flex justify-end mb-8">
                  <span className={`text-xs font-mono ${bio.length >= 160 ? 'text-terracotta font-bold' : 'text-ink/40'}`}>
                    {bio.length}/160
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-ink/5 text-ink py-4 rounded-2xl font-medium hover:bg-ink/10 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-ink text-cream py-4 rounded-2xl font-medium hover:bg-ink/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Sparkles className="text-terracotta" size={24} />
                <h2 className="text-3xl font-serif italic text-ink">Your Vibe</h2>
              </div>
              <p className="text-ink/60 mb-8">Select a few genres you love to personalize your feed.</p>
              
              <div className="flex flex-wrap gap-3 mb-12">
                {GENRES.map(genre => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                        isSelected 
                          ? 'bg-ink text-cream shadow-md scale-105' 
                          : 'bg-white text-ink/60 border border-ink/10 hover:border-ink/30'
                      }`}
                    >
                      {isSelected && <Check size={14} />}
                      <span>{genre}</span>
                    </button>
                  );
                })}
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-terracotta/10 border border-terracotta/20 rounded-xl text-terracotta text-sm text-center">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="w-full bg-ink text-cream py-4 rounded-2xl font-medium text-lg flex items-center justify-center space-x-2 hover:bg-ink/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter LitFlow</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
