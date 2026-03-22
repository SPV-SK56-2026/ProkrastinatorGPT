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

        const authCheck = await fetch('https://www.goprokrastinator.org/users/check', {
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

        if (!assignmentId || !pageDescription) {
          setCurrentAssignment(mockAssignment);
          setIsLoading(false);
          return;
        }

        const response = await fetch('https://www.goprokrastinator.org/prompt/preprocess', {
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

        const highlightOrange = (text: string, highlights: string[] | undefined): string => {
          if (!highlights) return text;
          let result = text;
          highlights.forEach(word => {
            result = result.replace(new RegExp(word, 'g'), `<span class="orangeText">${word}</span>`);
          });
          return result;
        };

        const highlightBlue = (text: string, highlight: string | undefined): string => {
          if (!highlight) return text;
          return text.replace(new RegExp(highlight, 'g'), `<span class="blueText">${highlight}</span>`);
        };

        const assignmentFromServer: Assignment = {
          title: raw.naslov || raw.title || '',
          description: highlightOrange(raw.opis || raw.explanation || '', raw.poudarki_opis),
          steps: Array.isArray(raw.koraki)
            ? raw.koraki.map((k: { besedilo: string; poudarek: string }, i: number) => ({
                id: String(i + 1),
                description: highlightBlue(k.besedilo, k.poudarek),
                isCompleted: false,
              }))
            : raw.steps_text
              ? raw.steps_text.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => ({
                  id: String(i + 1),
                  description: line.replace(/^\d+\.\s*/, ''),
                  isCompleted: false,
                }))
              : [],
          difficulty: `${raw.tezavnost || raw.difficulty || '?'}/10`,
          estimatedTime: raw.cas_min && raw.cas_max
            ? `${raw.cas_min}–${raw.cas_max} ure`
            : raw.estimated_minutes
              ? `${Math.round(raw.estimated_minutes / 60)} ure`
              : 'Ni podatka',
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

  const toggleStep = (id: string) => {
    if (!currentAssignment) return;
    const newSteps = currentAssignment.steps.map(step => 
      step.id === id ? { ...step, isCompleted: !step.isCompleted } : step
    );
    setCurrentAssignment({ ...currentAssignment, steps: newSteps });
  };

  const value: AppContextType = {
    currentAssignment,
    user,
    isLoading,
    error,
    setAssignment: setCurrentAssignment,
    setUser,
    setIsLoading: setIsLoading,
    setError,
    toggleStep,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
