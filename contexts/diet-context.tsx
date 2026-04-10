import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/firebaseConfig';

type ResultadoFinal = {
  imc?: string | null;
  tdee?: number | null;
  dietaIA?: string | null;
} | null;

type Respostas = Record<string, string | number>;

type Dieta = {
  id: string;
  nome: string;
  conteudo: string;
  createdAt: Date;
};

type DietContextType = {
  respostas: Respostas;
  setRespostas: React.Dispatch<React.SetStateAction<Respostas>>;
  resultadoFinal: ResultadoFinal;
  setResultadoFinal: React.Dispatch<React.SetStateAction<ResultadoFinal>>;
  dietasSalvas: Dieta[];
  dietTabVisible: boolean;
  isDietLoading: boolean;
  salvarDieta: (nome: string) => Promise<void>;
  excluirDieta: (id: string) => Promise<void>;
  limparDadosTemporarios: () => void;
};

const DietContext = createContext<DietContextType | null>(null);

export function DietProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [respostas, setRespostas] = useState<Respostas>({});
  const [resultadoFinal, setResultadoFinal] = useState<ResultadoFinal>(null);
  const [dietasSalvas, setDietasSalvas] = useState<Dieta[]>([]);
  const [dietTabVisible, setDietTabVisible] = useState(false);
  const [isDietLoading, setIsDietLoading] = useState(false);

  useEffect(() => {
    async function loadDiets() {
      if (!user) {
        setDietasSalvas([]);
        setDietTabVisible(false);
        setIsDietLoading(false);
        return;
      }

      setIsDietLoading(true);
      try {
        const dietsCollection = collection(db, 'users', user.uid, 'diets');
        const querySnapshot = await getDocs(dietsCollection);

        const diets: Dieta[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome || 'Dieta personalizada',
          conteudo: doc.data().conteudo || '',
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));

        setDietasSalvas(diets);
        setDietTabVisible(diets.length > 0);
      } catch (error) {
        console.error('[DietContext] Erro ao buscar dietas:', error);
        setDietasSalvas([]);
        setDietTabVisible(false);
      } finally {
        setIsDietLoading(false);
      }
    }

    loadDiets();
  }, [user]);

  const salvarDieta = async (nome: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado.');
    }

    if (!resultadoFinal?.dietaIA) {
      throw new Error('Não há dieta gerada para salvar.');
    }

    const dietsCollection = collection(db, 'users', user.uid, 'diets');
    const docRef = await addDoc(dietsCollection, {
      nome,
      conteudo: resultadoFinal.dietaIA,
      createdAt: new Date(),
    });

    const novaDieta: Dieta = {
      id: docRef.id,
      nome,
      conteudo: resultadoFinal.dietaIA,
      createdAt: new Date(),
    };

    setDietasSalvas(prev => [...prev, novaDieta]);
    setDietTabVisible(true);
  };

  const excluirDieta = async (id: string) => {
    if (!user) {
      return;
    }

    try {
      const dietDoc = doc(db, 'users', user.uid, 'diets', id);
      await deleteDoc(dietDoc);

      setDietasSalvas(prev => {
        const updated = prev.filter(dieta => dieta.id !== id);
        if (updated.length === 0) {
          setDietTabVisible(false);
        }
        return updated;
      });
    } catch (error) {
      console.error('[DietContext] Erro ao excluir dieta:', error);
    }
  };

  const limparDadosTemporarios = () => {
    setRespostas({});
    setResultadoFinal(null);
  };

  const value = useMemo(
    () => ({
      respostas,
      setRespostas,
      resultadoFinal,
      setResultadoFinal,
      dietasSalvas,
      salvarDieta,
      excluirDieta,
      isDietDeleted,
      isDietLoading,
    }), // ✅ CORREÇÃO AQUI: adicione `),`
    [
      respostas,
      resultadoFinal,
      dietasSalvas,
      isDietDeleted,
      isDietLoading,
    ]
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