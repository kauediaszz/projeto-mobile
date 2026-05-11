import { db } from '@/firebaseConfig';
import {
    collection,
    onSnapshot,
    query,
    Unsubscribe,
} from 'firebase/firestore';

export interface Stat {
  title: string;
  value: number;
}

/**
 * Subscribe to user count in real-time
 * @param callback - Function called with user count on updates
 * @param onError - Optional error handler
 * @returns Unsubscribe function
 */
export const subscribeToUserCount = (
  callback: (count: number) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const usersQuery = query(collection(db, 'users'));

    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        callback(snapshot.docs.length);
      },
      (error) => {
        console.error('Error subscribing to user count:', error);
        onError?.(error as Error);
      }
    );

    return unsubscribe;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Error setting up user count subscription:', err);
    onError?.(err);
    return () => {};
  }
};

/**
 * Subscribe to diets count in real-time
 * @param callback - Function called with diet count on updates
 * @param onError - Optional error handler
 * @returns Unsubscribe function
 */
export const subscribeTodietCount = (
  callback: (count: number) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const dietsQuery = query(collection(db, 'diets'));

    const unsubscribe = onSnapshot(
      dietsQuery,
      (snapshot) => {
        callback(snapshot.docs.length);
      },
      (error) => {
        console.error('Error subscribing to diet count:', error);
        onError?.(error as Error);
      }
    );

    return unsubscribe;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Error setting up diet count subscription:', err);
    onError?.(err);
    return () => {};
  }
};

/**
 * Format relative time string
 * @param date - Date to format
 * @returns Relative time string (e.g., "há 5 min")
 */
export const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes}min`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 7) return `há ${days}d`;

  return date.toLocaleDateString('pt-BR');
};
