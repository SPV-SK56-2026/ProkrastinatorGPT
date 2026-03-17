import React, { useState, useEffect, type ReactNode } from 'react';
import type { Assignment, User } from './types';
import { AppContext, type AppContextType, mockAssignment } from './AppContext.tsx';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        setError("login");
        return;
      }

      try {
        setIsLoading(true);

        const authCheck = await fetch('http://prokrastinatorgpt.ddns.net:5050/api/user/check', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!authCheck.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setError("login");
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const assignmentId = params.get("assignmentId");
        const pageDescription = params.get("description") || '';
        const pageTimeRemaining = params.get("timeRemaining") || '';

        const response = await fetch('http://prokrastinatorgpt.ddns.net:5050/api/prompt/preprocess', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: assignmentId,
            description: pageDescription,
            timeRemaining: pageTimeRemaining,
          }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const raw = data.data;

        const highlightOrange = (text: string, highlights: string[]): string => {
          let result = text;
          highlights.forEach(word => {
            result = result.replace(new RegExp(word, 'g'), `<span class="orangeText">${word}</span>`);
          });
          return result;
        };

        const highlightBlue = (text: string, highlight: string): string => {
          return text.replace(new RegExp(highlight, 'g'), `<span class="blueText">${highlight}</span>`);
        };

        const assignmentFromServer: Assignment = {
          title: raw.naslov,
          description: highlightOrange(raw.opis, raw.poudarki_opis),
          steps: raw.koraki.map((k: any, i: number) => ({
            id: String(i + 1),
            description: highlightBlue(k.besedilo, k.poudarek),
            isCompleted: false,
          })),
          difficulty: `${raw.tezavnost}/10`,
          estimatedTime: `${raw.cas_min}–${raw.cas_max} ure`,
        };

        setCurrentAssignment(assignmentFromServer);

      } catch (err) {
        console.error(err);
        setError("Napaka pri nalaganju.");
        setCurrentAssignment(mockAssignment);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
