import { FirebaseUser, subscribeToUsersSorted } from '@/services/firebase-users';
import { useEffect, useState } from 'react';

interface UseFirebaseUsersOptions {
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

interface UseFirebaseUsersReturn {
  users: FirebaseUser[];
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to subscribe to Firebase users in real-time
 * Automatically handles cleanup and error handling
 */
export const useFirebaseUsers = (
  options: UseFirebaseUsersOptions = {}
): UseFirebaseUsersReturn => {
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { sortField = 'name', sortDirection = 'asc' } = options;

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUsersSorted(
      (fetchedUsers) => {
        setUsers(fetchedUsers);
        setLoading(false);
      },
      sortField,
      sortDirection,
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [sortField, sortDirection]);

  return { users, loading, error };
};
