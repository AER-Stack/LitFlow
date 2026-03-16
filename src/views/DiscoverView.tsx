import React from 'react';
import { challenges, authors } from '../data';
import { Search, Trophy, Users, Tag, ChevronRight, BadgeCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const DiscoverView: React.FC = () => {
  const genres = ['Dark Academia', 'Mythology', 'Contemporary', 'Classics', 'Gothic', 'Fantasy', 'Romance', 'Mystery'];

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-32 md:pb-8 px-4">
      <h1 className="text-4xl font-serif font-bold tracking-tight mb-12">Discover</h1>

      {/* Search Bar */}
      <div className="relative mb-16">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/30" size={20} />
        <input
          type="text"
          placeholder="Search quotes, books, or authors..."
          className="w-full bg-ink/5 border-none rounded-2xl py-5 pl-16 pr-6 focus:ring-2 focus:ring-sage/50 transition-all font-medium"
        />
      </div>

      {/* Weekly Challenges */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Trophy className="text-terracotta" size={24} />
            <h2 className="text-2xl font-serif font-bold">Weekly Challenges</h2>
          </div>
          <button className="text-ink/40 hover:text-ink transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map(challenge => (
            <motion.div
              key={challenge.id}
              whileHover={{ y: -5 }}
              className="bg-cream border border-ink/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className="h-40 bg-charcoal relative">
                <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-cream font-bold text-xl">{challenge.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-ink/40 mb-3">
                  <span>Progress</span>
                  <span>{challenge.progress}%</span>
                </div>
                <div className="w-full h-2 bg-ink/5 rounded-full mb-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${challenge.progress}%` }}
                    className="h-full bg-sage"
                  />
                </div>
                <div className="flex items-center text-ink/60 text-sm">
                  <Users size={16} className="mr-2" />
                  <span>{challenge.participants.toLocaleString()} participants</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Author Spotlight */}
      <section className="mb-16">
        <div className="flex items-center space-x-3 mb-8">
          <Users className="text-sage" size={24} />
          <h2 className="text-2xl font-serif font-bold">Author Spotlight</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authors.map(author => (
            <motion.div
              key={author.id}
              whileHover={{ x: 5 }}
              className="flex items-center space-x-6 bg-cream border border-ink/5 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all"
            >
              <img src={author.image} alt={author.name} className="w-20 h-20 rounded-2xl border border-ink/5" />
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-lg">{author.name}</h3>
                  {author.isVerified && <BadgeCheck size={18} className="text-sage" fill="currentColor" />}
                </div>
                <p className="text-ink/60 text-sm line-clamp-2">{author.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Genres */}
      <section>
        <div className="flex items-center space-x-3 mb-8">
          <Tag className="text-ink/40" size={24} />
          <h2 className="text-2xl font-serif font-bold">Browse by Genre</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {genres.map(genre => (
            <button
              key={genre}
              className="px-6 py-3 bg-cream border border-ink/10 rounded-2xl font-medium hover:bg-charcoal hover:text-cream hover:border-charcoal transition-all shadow-sm"
            >
              {genre}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
