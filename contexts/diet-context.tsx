import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from "./auth-context";

type DietData = { nome: string; texto: string; data: string } | null;
type Respostas = Record<string, string | number>;
type ResultadoFinal = {
  imc?: string | null;
  tdee?: number | null;
  dietaIA?: string | null;
} | null;

type DietContextType = {
  respostas: Respostas;
  setRespostas: React.Dispatch<React.SetStateAction<Respostas>>;
  resultadoFinal: ResultadoFinal;
  setResultadoFinal: React.Dispatch<React.SetStateAction<ResultadoFinal>>;
  hasCompletedFirstDiet: boolean;
  setHasCompletedFirstDiet: (val: boolean) => void;
  savedDiet: DietData;
  setSavedDiet: (diet: DietData) => void;
};

const DietContext = createContext<DietContextType | null>(null);

export function DietProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [respostas, setRespostas] = useState<Respostas>({});
  const [resultadoFinal, setResultadoFinal] = useState<ResultadoFinal>(null);
  
  const [hasCompletedFirstDiet, setHasCompletedFirstDiet] = useState(false);
  const [savedDiet, setSavedDiet] = useState<DietData>(null);

  useEffect(() => {
    // Garante que o usuário e o e-mail existem
    if (user && user.email) {
      const fetchUserData = async () => {
        try {
          // Busca o documento exato com o e-mail do usuário (ex: kauedias@dietapp.local)
          const userDoc = await getDoc(doc(db, "users", user.email as string));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setHasCompletedFirstDiet(data.hasCompletedFirstDiet || false);
            setSavedDiet(data.currentDiet || null);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const value = useMemo(() => ({ 
    respostas, setRespostas, 
    resultadoFinal, setResultadoFinal,
    hasCompletedFirstDiet, setHasCompletedFirstDiet,
    savedDiet, setSavedDiet
  }), [respostas, resultadoFinal, hasCompletedFirstDiet, savedDiet]);

  return <DietContext.Provider value={value}>{children}</DietContext.Provider>;
}

export function useDiet() {
  const context = useContext(DietContext);
  if (!context) throw new Error('useDiet must be used within DietProvider');
  return context;
}