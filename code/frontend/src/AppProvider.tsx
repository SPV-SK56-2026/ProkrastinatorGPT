import React, { useState, useEffect, type ReactNode } from 'react';
import type { Assignment, User } from './types';
import { AppContext, type AppContextType, mockAssignment, mockUser } from './AppContext.tsx';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Začnemo z loadingom
  const [error, setError] = useState<string | null>(null);

  // ko se app odpre se to zazene
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Tukaj pokličemo tvoj API
        const response = await fetch('http://prokrastinatorgpt.ddns.net:5050/api/assignments');
        
        if (!response.ok) {
          throw new Error('Težava pri povezavi s strežnikom');
        }

        const data = await response.json();

        // vrnemo prvi element seznama
        const assignmentFromServer = Array.isArray(data) ? data[0] : data;
        
        setCurrentAssignment(assignmentFromServer);
      } catch (err) {
        console.error("API Error:", err);
        setError("Napaka pri nalaganju. Uporabljam testne podatke.");
          // Če API ne dela naložimo mock podatke
        setCurrentAssignment(mockAssignment);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // just once

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
