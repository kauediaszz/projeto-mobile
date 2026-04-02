import React, { createContext, useContext, useMemo, useState } from 'react';

type ResultadoFinal = {
  imc: string | null;
  tdee: number | null;
} | null;

type Respostas = Record<string, string | number>;

type DietContextType = {
  respostas: Respostas;
  setRespostas: React.Dispatch<React.SetStateAction<Respostas>>;
  resultadoFinal: ResultadoFinal;
  setResultadoFinal: React.Dispatch<React.SetStateAction<ResultadoFinal>>;
};

const DietContext = createContext<DietContextType | null>(null);

export function DietProvider({ children }: { children: React.ReactNode }) {
  const [respostas, setRespostas] = useState<Respostas>({});
  const [resultadoFinal, setResultadoFinal] = useState<ResultadoFinal>(null);

  const value = useMemo(
    () => ({ respostas, setRespostas, resultadoFinal, setResultadoFinal }),
    [respostas, resultadoFinal]
  );

  return <DietContext.Provider value={value}>{children}</DietContext.Provider>;
}

export function useDiet() {
  const context = useContext(DietContext);
  if (!context) {
    throw new Error('useDiet must be used within DietProvider');
  }
  return context;
}
