import { createContext, useContext } from 'react';
import type { AppState, Assignment, User } from './types';

export interface AppContextType extends AppState {
  setAssignment: (assignment: Assignment | null) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock podatki na podlagi trenutnega stanja v index.tsx
export const mockAssignment: Assignment = {
  title: "Organizacijski diagram podjetja",
  description: "Naloga zahteva izdelavo <span class=\"orangeText\">organizacijskega diagrama podjetja</span>, ki prikazuje strukturo in naloge posameznikov ali oddelkov. <span class=\"orangeText\">Priložiti je treba log chata</span>, ki dokazuje, da so vsi člani ekipe sodelovali in oddali isto datoteko.",
  steps: [
    { id: "1", description: "Zbrati informacije o strukturi podjetja in nalogah posameznikov/oddelkov.", isCompleted: false },
    { id: "2", description: "Izdelati organizacijskih diagram, ki prikazuje hierarhijo in odgovornosti.", isCompleted: false },
    { id: "3", description: "Sodelovati v ekipi in se dogovoriti o vsebini ter oblikovanju diagrama.", isCompleted: false },
    { id: "4", description: "Zabeležiti log chata kot dokaz aktivnega sodelovanja vseh članov.", isCompleted: false },
    { id: "5", description: "Oddati diagram in log chata v skupni datoteki.", isCompleted: false }
  ],
  difficulty: "4/10",
  estimatedTime: "2-3 ure"
};

export const mockUser: User = {
  id: 1,
  email: "janez.novak@example.com",
  isLoggedIn: true
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    // Vrni mock podatke namesto errorja, če provider ni na voljo (npr. pri testiranju ali če pride do težav z renderiranjem)
    console.warn('useApp must be used within an AppProvider. Returning mock data as fallback.');
    return {
      currentAssignment: mockAssignment,
      user: mockUser,
      isLoading: false,
      error: null,
      setAssignment: () => {},
      setUser: () => {},
      setIsLoading: () => {},
      setError: () => {},
    } as AppContextType;
  }
  return context;
};
