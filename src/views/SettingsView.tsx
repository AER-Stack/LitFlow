import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Shield, Bell, Moon, LogOut, Save, Loader2, ChevronRight, Camera } from 'lucide-react';
import { motion } from 'motion/react';

const GENRES = [
  'Fiction', 'Non-Fiction', 'Classic', 'Philosophy', 'Poetry', 
  'Dystopian', 'Mystery', 'History', 'Science', 'Biography'
];

export const SettingsView: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    bio: currentUser?.bio || '',
    avatar_url: currentUser?.avatar_url || '',
    preferredGenres: currentUser?.preferredGenres || []
  });

  const [toggles, setToggles] = useState({
    darkMode: false,
    notifications: true
  });

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setErrorMessage(null);
    
    try {
      await updateProfile(formData);
      setSuccessMessage('Profile updated successfully!');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update profile');
      if (error.message === 'User not found.') {
        logout();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      preferredGenres: prev.preferredGenres.includes(genre)
        ? prev.preferredGenres.filter(g => g !== genre)
        : [...prev.preferredGenres, genre]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 pb-32">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-ink mb-2">Settings</h1>
        <p className="text-ink/60 text-lg italic">Personalize your literary journey.</p>
      </div>

      <div className="space-y-12">
        {/* Profile Section */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-terracotta/10 rounded-lg text-terracotta">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-ink">Profile</h2>
          </div>

          <div className="space-y-6 bg-white p-8 rounded-3xl border border-ink/5 shadow-sm">
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative group">
                <img 
                  src={formData.avatar_url || 'https://picsum.photos/seed/default/200'} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-cream shadow-md"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-ink/60 uppercase tracking-wider mb-2">Avatar URL</label>
                <input 
                  type="text" 
                  value={formData.avatar_url}
                  onChange={e => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-cream border border-ink/5 focus:border-terracotta/30 outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-ink/60 uppercase tracking-wider mb-2">Username</label>
                <input 
                  type="text" 
                  maxLength={50}
                  value={formData.username}
                  onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-cream border border-ink/5 focus:border-terracotta/30 outline-none transition-all"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-bold text-ink/60 uppercase tracking-wider">Bio</label>
                  <span className={`text-xs ${formData.bio.length > 160 ? 'text-red-500' : 'text-ink/40'}`}>
                    {formData.bio.length}/160
                  </span>
                </div>
                <textarea 
                  rows={3}
                  maxLength={160}
                  value={formData.bio}
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-cream border border-ink/5 focus:border-terracotta/30 outline-none transition-all resize-none"
                  placeholder="Tell us about your love for books..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-sage/10 rounded-lg text-sage">
              <Shield size={20} />
            </div>
            <h2 className="text-xl font-bold text-ink">Preferences</h2>
          </div>

          <div className="space-y-8 bg-white p-8 rounded-3xl border border-ink/5 shadow-sm">
            <div>
              <label className="block text-sm font-bold text-ink/60 uppercase tracking-wider mb-4">Preferred Genres</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.preferredGenres.includes(genre)
                        ? 'bg-terracotta text-white shadow-md'
                        : 'bg-cream text-ink/60 hover:bg-ink/5'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-ink/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Moon size={20} className="text-ink/40" />
                  <span className="font-medium text-ink">Dark Mode</span>
                </div>
                <button 
                  onClick={() => setToggles(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${toggles.darkMode ? 'bg-terracotta' : 'bg-ink/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${toggles.darkMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell size={20} className="text-ink/40" />
                  <span className="font-medium text-ink">Notifications</span>
                </div>
                <button 
                  onClick={() => setToggles(prev => ({ ...prev, notifications: !prev.notifications }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${toggles.notifications ? 'bg-terracotta' : 'bg-ink/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${toggles.notifications ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center space-x-2 w-full p-4 rounded-2xl bg-charcoal text-cream font-bold hover:bg-ink transition-all shadow-lg disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Save Changes</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center justify-center space-x-2 w-full p-4 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-2">
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-xl font-medium"
          >
            {successMessage}
          </motion.div>
        )}
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 text-white px-6 py-3 rounded-full shadow-xl font-medium"
          >
            {errorMessage}
          </motion.div>
        )}
      </div>
    </div>
  );
};
