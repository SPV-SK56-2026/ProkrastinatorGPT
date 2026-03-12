import React, { useState, type ReactNode } from 'react';
import type { Assignment, User } from './types';
import { AppContext, type AppContextType, mockAssignment, mockUser } from './AppContext.tsx';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(mockAssignment);
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const value: AppContextType = {
    currentAssignment,
    user,
    isLoading,
    error,
    setAssignment: setCurrentAssignment,
    setUser,
    setIsLoading,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
