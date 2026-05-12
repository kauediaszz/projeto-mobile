// Admin Panel - Integration Examples & Tips

import { db } from '@/firebaseConfig';
import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    Timestamp,
    where
} from 'firebase/firestore';

// ============================================
// 1. CREATING TEST DATA FOR DEVELOPMENT
// ============================================

/**
 * Create a test user in Firestore
 * Usage: createTestUser('testuser@example.com', 'Test User')
 */
export async function createTestUser(
  email: string,
  displayName: string = 'Test User'
) {
  try {
    const userRef = await addDoc(collection(db, 'users'), {
      email,
      displayName,
      name: displayName,
      createdAt: Timestamp.now(),
      profile: {
        age: 25,
        height: 180,
        weight: 75,
        gender: 'M',
      },
    });

    console.log('Test user created:', userRef.id);
    return userRef.id;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

/**
 * Create a test diet in Firestore
 * Usage: createTestDiet(userId, 'user@example.com')
 */
export async function createTestDiet(userId: string, userEmail: string) {
  try {
    const dietRef = await addDoc(collection(db, 'diets'), {
      userId,
      userEmail,
      userCreatedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      content: `Dieta de teste gerada em ${new Date().toLocaleString('pt-BR')}`,
      mealPlan: {
        breakfast: ['Ovos mexidos', 'Pão integral', 'Suco de laranja'],
        lunch: ['Frango grelhado', 'Arroz integral', 'Salada'],
        dinner: ['Peixe', 'Batata doce', 'Brócolis'],
      },
      restrictions: ['sem_gluten'],
      goal: 'weight_loss',
      calories: 2000,
    });

    console.log('Test diet created:', dietRef.id);
    return dietRef.id;
  } catch (error) {
    console.error('Error creating test diet:', error);
    throw error;
  }
}

/**
 * Bulk create test data
 * Usage: createBulkTestData(5) - creates 5 users with diets
 */
export async function createBulkTestData(count: number = 5) {
  try {
    const userIds = [];

    // Create users
    for (let i = 0; i < count; i++) {
      const userId = await createTestUser(
        `testuser${i + 1}@example.com`,
        `Test User ${i + 1}`
      );
      userIds.push(userId);

      // Create 1-2 diets per user
      for (let j = 0; j < Math.random() > 0.5 ? 2 : 1; j++) {
        await createTestDiet(userId, `testuser${i + 1}@example.com`);
      }
    }

    console.log(`Created ${count} test users with diets`);
    return userIds;
  } catch (error) {
    console.error('Error creating bulk test data:', error);
    throw error;
  }
}

// ============================================
// 2. QUERYING DATA FOR ADMIN PANEL
// ============================================

/**
 * Get total user count
 */
export async function getUserCount(): Promise<number> {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.size;
  } catch (error) {
    console.error('Error getting user count:', error);
    return 0;
  }
}

/**
 * Get total diet count
 */
export async function getDietCount(): Promise<number> {
  try {
    const dietsSnapshot = await getDocs(collection(db, 'diets'));
    return dietsSnapshot.size;
  } catch (error) {
    console.error('Error getting diet count:', error);
    return 0;
  }
}

/**
 * Get count of users created today
 */
export async function getUsersRegisteredToday(): Promise<number> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    const q = query(
      collection(db, 'users'),
      where('createdAt', '>=', todayTimestamp)
    );

    const usersSnapshot = await getDocs(q);
    return usersSnapshot.size;
  } catch (error) {
    console.error('Error getting today users count:', error);
    return 0;
  }
}

/**
 * Get recent activities (mixed diets + registrations)
 */
export async function getRecentActivities(limit: number = 5) {
  try {
    // Get recent diets
    const dietsQuery = query(
      collection(db, 'diets'),
      orderBy('createdAt', 'desc')
    );
    const dietsSnapshot = await getDocs(dietsQuery);

    const dietActivities = dietsSnapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      type: 'diet' as const,
      email: doc.data().userEmail || 'Unknown',
      timestamp: doc.data().createdAt?.toDate() || new Date(),
    }));

    // Get recent registrations
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );
    const usersSnapshot = await getDocs(usersQuery);

    const registrationActivities = usersSnapshot.docs.slice(0, limit).map(doc => ({
      id: `reg_${doc.id}`,
      type: 'registration' as const,
      email: doc.data().email || 'Unknown',
      timestamp: doc.data().createdAt?.toDate() || new Date(),
    }));

    // Merge and sort by timestamp
    const allActivities = [...dietActivities, ...registrationActivities]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return allActivities;
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return [];
  }
}

/**
 * Get all users with details
 */
export async function getAllUsers() {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );
    const usersSnapshot = await getDocs(usersQuery);

    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
      displayName: doc.data().displayName || doc.data().name || '',
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

/**
 * Search users by email or name
 */
export async function searchUsers(searchTerm: string) {
  try {
    const allUsers = await getAllUsers();

    return allUsers.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

/**
 * Get all logs (events)
 */
export async function getAllLogs() {
  try {
    // Get diets
    const dietsQuery = query(
      collection(db, 'diets'),
      orderBy('createdAt', 'desc')
    );
    const dietsSnapshot = await getDocs(dietsQuery);

    const dietLogs = dietsSnapshot.docs.map(doc => ({
      id: doc.id,
      type: 'diet' as const,
      email: doc.data().userEmail || 'Unknown',
      userCreatedAt: doc.data().userCreatedAt?.toDate() || new Date(),
      eventAt: doc.data().createdAt?.toDate() || new Date(),
      title: 'Dieta gerada',
    }));

    // Get registrations
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );
    const usersSnapshot = await getDocs(usersQuery);

    const registrationLogs = usersSnapshot.docs.map(doc => ({
      id: `reg_${doc.id}`,
      type: 'registration' as const,
      email: doc.data().email || 'Unknown',
      userCreatedAt: doc.data().createdAt?.toDate() || new Date(),
      eventAt: doc.data().createdAt?.toDate() || new Date(),
      title: 'Novo registro',
    }));

    // Merge and sort
    return [...dietLogs, ...registrationLogs]
      .sort((a, b) => b.eventAt.getTime() - a.eventAt.getTime());
  } catch (error) {
    console.error('Error getting all logs:', error);
    return [];
  }
}

// ============================================
// 3. ADMIN AUTH HELPERS
// ============================================

/**
 * Check if user is authenticated as admin
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('adminAuth') === 'true';
  }
  return false;
}

/**
 * Save admin authentication
 */
export function saveAdminAuth(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('adminAuth', 'true');
  }
}

/**
 * Clear admin authentication
 */
export function clearAdminAuth(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('adminAuth');
  }
}

// ============================================
// 4. FORMATTING HELPERS
// ============================================

/**
 * Format date to DD/MM/YYYY
 */
export function formatDateBR(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format time to HH:mm
 */
export function formatTimeBR(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format relative time (e.g., "há 3 min")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes}min`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 7) return `há ${days}d`;

  return formatDateBR(date);
}

// ============================================
// 5. AVATAR & COLOR HELPERS
// ============================================

/**
 * Get avatar colors array
 */
export function getAvatarColor(email: string): string {
  const colors = [
    '#58a6ff', // Blue
    '#79c0ff', // Light Blue
    '#d29922', // Orange
    '#17e5e6', // Cyan
    '#3fb950', // Green
  ];

  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get avatar initial
 */
export function getAvatarInitial(name: string, email: string): string {
  if (name && name.length > 0) {
    return name.charAt(0).toUpperCase();
  }
  return email.charAt(0).toUpperCase();
}

// ============================================
// 6. USAGE EXAMPLES
// ============================================

/**
 * Example: Create test data and verify
 *
 * async function setupTestData() {
 *   // Create test data
 *   await createBulkTestData(3);
 *
 *   // Verify creation
 *   const userCount = await getUserCount();
 *   const dietCount = await getDietCount();
 *   const todayCount = await getUsersRegisteredToday();
 *
 *   console.log(`Users: ${userCount}, Diets: ${dietCount}, Today: ${todayCount}`);
 * }
 */

/**
 * Example: Use in a component
 *
 * import { getAllUsers, searchUsers } from '@/utils/admin-helpers';
 *
 * export default function AdminScreen() {
 *   useEffect(() => {
 *     getAllUsers().then(users => {
 *       console.log(users);
 *     });
 *   }, []);
 * }
 */
