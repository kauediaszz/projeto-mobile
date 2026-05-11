// FIRESTORE STRUCTURE FOR ADMIN PANEL
// This file documents the expected Firestore structure for the admin panel to work properly

// Collection: users
// Documents should have this structure:
{
  "uid": "user-unique-id",
  "email": "usuario@email.com",
  "displayName": "Nome do Usuário", // Optional
  "name": "Nome Alternativo", // Optional - used as fallback
  "createdAt": Timestamp, // IMPORTANT: Must be a Firestore Timestamp
  "profile": {
    "age": 25,
    "height": 180,
    "weight": 75,
    // ... other profile fields
  }
  // ... other user fields
}

// Collection: diets
// Documents should have this structure:
{
  "id": "diet-unique-id",
  "userId": "user-id-reference",
  "userEmail": "usuario@email.com",
  "userCreatedAt": Timestamp, // IMPORTANT: User's creation date
  "createdAt": Timestamp, // IMPORTANT: Diet creation date (Firestore Timestamp)
  "content": "Full diet content as string or object",
  "mealPlan": {
    // ... structured meal plan
  },
  "restrictions": ["vegan", "gluten-free"],
  "goal": "weight_loss",
  // ... other diet fields
}

// Collection: logs (OPTIONAL - for direct event logging)
// If you want to track events separately:
{
  "id": "log-unique-id",
  "userId": "user-id",
  "userEmail": "usuario@email.com",
  "userCreatedAt": Timestamp,
  "eventType": "diet_generated" | "user_registered",
  "eventAt": Timestamp,
  "metadata": {
    // Additional event data
  }
}

// IMPORTANT NOTES:
// 1. Use Firestore Timestamp objects, NOT JavaScript Date objects
// 2. The admin panel queries these collections:
//    - users: to get user count and activity
//    - diets: to get diet count and activity
//    - Both: to generate stats and activity feed
//
// 3. In React/Node.js:
//    - Use: { createdAt: Timestamp.fromDate(new Date()) }
//    - Don't use: { createdAt: new Date() }
//
// 4. When creating users programmatically:
//    await setDoc(doc(db, "users", userId), {
//      email: userEmail,
//      createdAt: Timestamp.now(),
//      // ... other fields
//    });
//
// 5. When creating diets:
//    await setDoc(doc(db, "diets", dietId), {
//      userId: userId,
//      userEmail: userEmail,
//      createdAt: Timestamp.now(),
//      // ... other fields
//    });

// Example: How to create test data for development
/*
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

async function createTestData() {
  // Create test user
  await addDoc(collection(db, 'users'), {
    email: 'test@example.com',
    displayName: 'Test User',
    createdAt: Timestamp.now(),
    profile: {
      age: 25,
      height: 180,
      weight: 75
    }
  });

  // Create test diet
  await addDoc(collection(db, 'diets'), {
    userId: 'test-user-id',
    userEmail: 'test@example.com',
    userCreatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    content: 'Sample diet plan...',
    goal: 'weight_loss'
  });
}
*/
