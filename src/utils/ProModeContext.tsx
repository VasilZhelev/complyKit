import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ProModeContextType {
  proMode: boolean;
  setProMode: (value: boolean) => void;
}

const ProModeContext = createContext<ProModeContextType | undefined>(undefined);

export const useProMode = () => {
  const context = useContext(ProModeContext);
  if (!context) {
    throw new Error('useProMode must be used within a ProModeProvider');
  }
  return context;
};

export const ProModeProvider = ({ children }: { children: ReactNode }) => {
  const [proMode, setProModeState] = useState<boolean>(() => {
    const stored = localStorage.getItem('proMode');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('proMode', proMode ? 'true' : 'false');
  }, [proMode]);

  const setProMode = (value: boolean) => {
    setProModeState(value);
  };

  return (
    <ProModeContext.Provider value={{ proMode, setProMode }}>
      {children}
    </ProModeContext.Provider>
  );
}; 