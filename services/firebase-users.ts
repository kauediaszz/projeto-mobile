import { db } from '@/firebaseConfig';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    QueryConstraint,
    Unsubscribe
} from 'firebase/firestore';

export interface FirebaseUser {
  id: string;
  email: string;
  name: string;
  lowercaseName: string;
  uid: string;
}

/**
 * Subscribe to real-time user updates
 * @param callback - Function called with user array on updates
 * @param onError - Optional error handler
 * @param constraints - Optional Firestore query constraints
 * @returns Unsubscribe function
 */
export const subscribeToUsers = (
  callback: (users: FirebaseUser[]) => void,
  onError?: (error: Error) => void,
  constraints: QueryConstraint[] = []
): Unsubscribe => {
  try {
    const userQuery = query(
      collection(db, 'users'),
      ...constraints
    );

    const unsubscribe = onSnapshot(
      userQuery,
      (snapshot) => {
        const users: FirebaseUser[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email || '',
          name: doc.data().name || '',
          lowercaseName: doc.data().lowercaseName || '',
          uid: doc.data().uid || '',
        }));

        callback(users);
      },
      (error) => {
        console.error('Error subscribing to users:', error);
        onError?.(error as Error);
      }
    );

    return unsubscribe;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Error setting up user subscription:', err);
    onError?.(err);
    return () => {};
  }
};

/**
 * Subscribe to users with sorting
 * @param callback - Function called with user array on updates
 * @param sortField - Field to sort by
 * @param sortDirection - 'asc' or 'desc'
 * @param onError - Optional error handler
 * @returns Unsubscribe function
 */
export const subscribeToUsersSorted = (
  callback: (users: FirebaseUser[]) => void,
  sortField: string = 'name',
  sortDirection: 'asc' | 'desc' = 'asc',
  onError?: (error: Error) => void
): Unsubscribe => {
  const constraints: QueryConstraint[] = [
    orderBy(sortField, sortDirection === 'desc' ? 'desc' : 'asc'),
  ];

  return subscribeToUsers(callback, onError, constraints);
};

/**
 * Search users in memory (client-side)
 * @param users - Array of users
 * @param searchTerm - Term to search for
 * @param fields - Fields to search in
 * @returns Filtered array
 */
export const searchUsersLocal = (
  users: FirebaseUser[],
  searchTerm: string,
  fields: (keyof FirebaseUser)[] = ['name', 'email', 'lowercaseName']
): FirebaseUser[] => {
  if (!searchTerm.trim()) {
    return users;
  }

  const term = searchTerm.toLowerCase();

  return users.filter((user) =>
    fields.some((field) => {
      const value = user[field];
      return value && String(value).toLowerCase().includes(term);
    })
    
  );
};
