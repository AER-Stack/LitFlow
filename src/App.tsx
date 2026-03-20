/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { FeedView } from './views/FeedView';
import { DiscoverView } from './views/DiscoverView';
import { ProfileView } from './views/ProfileView';
import { SavedView } from './views/SavedView';
import { SettingsView } from './views/SettingsView';
import { NotificationsView } from './views/NotificationsView';
import { EmbedView } from './views/EmbedView';
import { AuthView } from './views/AuthView';
import { OnboardingView } from './views/OnboardingView';
import { BookDetailModal } from './components/BookDetailModal';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { currentView, currentUser, isInitialLoading } = useAppContext();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const hasCompletedOnboarding = localStorage.getItem(`onboarding_${currentUser.id}`);
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [currentUser]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ink/10 border-t-ink rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser && currentView !== 'embed') {
    return <AuthView />;
  }

  if (showOnboarding && currentUser) {
    return <OnboardingView onComplete={() => setShowOnboarding(false)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <FeedView />;
      case 'discover':
        return <DiscoverView />;
      case 'profile':
        return <ProfileView />;
      case 'saved':
        return <SavedView />;
      case 'settings':
        return <SettingsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'embed':
        return <EmbedView />;
      default:
        return <FeedView />;
    }
  };

  if (currentView === 'embed') {
    return (
      <div className="min-h-screen bg-ink selection:bg-terracotta/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream selection:bg-terracotta/30">
      <Navigation />
      
      <main className="md:ml-64 transition-all duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BookDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
