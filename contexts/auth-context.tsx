import { auth, db } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
  user: FirebaseUser | null;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    // Forçar logout na inicialização para desabilitar login automático.
    const resetAuth = async () => {
      try {
        await signOut(auth);
      } catch (_e) {
        // ignorar se não houver sessão ativa
      }
    };

    resetAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (identifier: string, password: string) => {
    if (identifier.includes("@")) {
      await signInWithEmailAndPassword(auth, identifier, password);
      return;
    }

    const username = identifier.toLowerCase();
    const userDoc = await getDoc(doc(db, "users", username));

    if (!userDoc.exists()) {
      throw new Error("Usuário não encontrado");
    }

    const { email } = userDoc.data() as { email: string };
    if (!email) {
      throw new Error("Usuário não encontrado");
    }

    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (username: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (!userCredential.user) {
      throw new Error("Falha ao criar usuário");
    }

    await updateProfile(userCredential.user, { displayName: username });

    const normalizedUsername = username.toLowerCase();
    await setDoc(doc(db, "users", normalizedUsername), {
      email,
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      signIn,
      signUp,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
