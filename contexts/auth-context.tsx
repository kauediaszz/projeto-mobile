import { auth, db } from "@/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  initializing: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Ouvir mudanças no estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        };
        setUser(authUser);
      } else {
        setUser(null);
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (identifier: string, password: string) => {
    let email = identifier;

    if (!identifier.includes("@")) {
      const username = identifier.toLowerCase();
      const userDoc = await getDoc(doc(db, "users", username));

      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      const data = userDoc.data() as { email?: string };
      if (!data.email) {
        throw new Error("Usuário não encontrado");
      }

      email = data.email;
    }

    // O Firebase Auth vai automaticamente persistir a sessão e disparar onAuthStateChanged
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

    // O Firebase Auth vai automaticamente persistir a sessão e disparar onAuthStateChanged
  };

  const logout = async () => {
    try {
      // O Firebase Auth vai limpar sua persistência e disparar onAuthStateChanged com null
      await signOut(auth);
      console.log("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro durante logout:", error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      initializing,
      signIn,
      signUp,
      logout,
    }),
    [user, initializing],
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
