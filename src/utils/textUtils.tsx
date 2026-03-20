import React from 'react';
import { users } from '../data';

export const renderCommentText = (text: string, viewProfile: (userId: string) => void) => {
  const parts = text.split(/(@\w+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      const username = part.slice(1);
      const mentionedUser = users.find(u => u.username === username);
      if (mentionedUser) {
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              viewProfile(mentionedUser.id);
            }}
            className="text-sage font-bold hover:underline transition-all"
          >
            {part}
          </button>
        );
      }
    }
    return <span key={index}>{part}</span>;
  });
};
