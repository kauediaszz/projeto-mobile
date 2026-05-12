# Admin Panel - Setup Guide

## 🚀 Quick Start

### 1. Verify Files Created
Confirm that these files exist in your project:

```
app/
  admin/
    _layout.tsx          ✅ Main admin layout with route protection
    login.tsx            ✅ Login screen
    home.tsx             ✅ Dashboard with stats
    usuarios.tsx         ✅ User management
    logs.tsx             ✅ Event logs

components/
  admin/
    admin-nav-bar.tsx    ✅ Navigation bar

contexts/
  admin-auth-context.tsx ✅ Auth state management

constants/
  admin-theme.ts        ✅ Design system colors

utils/
  admin-helpers.ts      ✅ Helper functions

Documentation:
  ADMIN_PANEL_README.md        ✅ Overview
  ADMIN_TESTING_CHECKLIST.md   ✅ Testing guide
  FIRESTORE_STRUCTURE.js       ✅ Data structure
  SETUP.md                     ✅ This file
```

### 2. Verify Dependencies
Make sure these are installed (check `package.json`):
- ✅ firebase (^12.11.0+)
- ✅ expo-router (~6.0.23+)
- ✅ react-native (0.81.5+)
- ✅ react (19.1.0+)

Install if missing:
```bash
npm install
```

### 3. Update Root Layout
Your `app/_layout.tsx` should include AdminAuthProvider:

```tsx
import { AdminAuthProvider } from "@/contexts/admin-auth-context";

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <MainLayout />
        </AdminAuthProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}
```

✅ This is already done in your project.

### 4. Verify Firebase Configuration
Check `firebaseConfig.ts`:

```tsx
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Your config...
};

export const auth = getAuth(app);
export const db = getFirestore(app);
```

✅ Your configuration is already set up.

---

## 📊 Data Setup

### Step 1: Create Firestore Collections

In Firebase Console, create these collections if they don't exist:

#### Collection: `users`
- **Document structure:**
  ```json
  {
    "email": "user@example.com",
    "displayName": "User Name",
    "createdAt": Timestamp,
    "profile": { ... }
  }
  ```

#### Collection: `diets`
- **Document structure:**
  ```json
  {
    "userId": "user-id",
    "userEmail": "user@example.com",
    "userCreatedAt": Timestamp,
    "createdAt": Timestamp,
    "content": "Diet content here",
    "mealPlan": { ... }
  }
  ```

### Step 2: Create Test Data (Optional)

Option A: Use Firebase Console
1. Go to Firebase Console → Firestore
2. Create documents manually with sample data
3. Ensure dates are Firestore Timestamps

Option B: Use Helper Functions
1. Create a temporary test file or use browser console:

```typescript
import { createBulkTestData } from '@/utils/admin-helpers';

// Create 5 test users with diets
createBulkTestData(5);
```

Option C: Create via Your App
When users register in your app, ensure they're saved to Firestore with:
- Correct field names
- Firestore Timestamps (not JS Date)
- Required fields: email, createdAt

---

## 🔐 Testing the Admin Panel

### Access the Admin Panel

1. **Start your development server:**
   ```bash
   npm run web  # or npm run start
   ```

2. **Navigate to admin login:**
   - Open: `http://localhost:8081/admin/login` (or your dev URL)

3. **Login with demo credentials:**
   - **Username:** `admin`
   - **Password:** `123`

4. **After successful login:**
   - You'll be redirected to `/admin/home`
   - sessionStorage will contain `adminAuth: true`

### Test Each Screen

**Home Screen:**
- [ ] Stats cards show numbers
- [ ] Recent activity displays events
- [ ] Avatar and greeting visible

**Users Screen:**
- [ ] Users table shows all users
- [ ] Search filters by name/email
- [ ] Avatar colors are consistent

**Logs Screen:**
- [ ] Logs show mixed events
- [ ] Filters work (Todos/Dietas/Registros)
- [ ] Timestamps format correctly

---

## 🛠️ Development Tips

### Add a New Admin Route

1. Create file: `app/admin/new-route.tsx`
2. It's automatically protected by `app/admin/_layout.tsx`
3. Import navbar if needed: `import AdminNavBar from '@/components/admin/admin-nav-bar'`
4. Update navbar navigation in `admin-nav-bar.tsx`

### Use Helper Functions

```typescript
import { 
  getUserCount, 
  getAllUsers, 
  searchUsers,
  formatDateBR 
} from '@/utils/admin-helpers';

// In your component
useEffect(() => {
  getUserCount().then(count => console.log(count));
}, []);
```

### Change Admin Credentials

Edit `contexts/admin-auth-context.tsx`:

```tsx
const login = (username: string, password: string): boolean => {
  const ADMIN_USERNAME = 'your-username';  // ← Change here
  const ADMIN_PASSWORD = 'your-password';  // ← Change here
  // ...
};
```

⚠️ **Warning:** This is hardcoded client-side. For production, implement proper backend authentication.

### Customize Colors

Edit `constants/admin-theme.ts`:

```typescript
export const AdminColors = {
  bg: {
    primary: '#0d1117',      // ← Change colors here
    secondary: '#161b22',
    // ...
  },
  // ...
};
```

---

## 🐛 Troubleshooting

### "Cannot find module" Error
- [ ] Run `npm install`
- [ ] Check file paths are correct
- [ ] Verify imports match exact filenames

### Login doesn't work
- [ ] Check credentials: `admin` / `123`
- [ ] Open browser console for errors
- [ ] Verify AdminAuthProvider is in root layout

### No data on Home screen
- [ ] Check Firestore has data in `users` and `diets`
- [ ] Verify collection names are exact (case-sensitive)
- [ ] Confirm documents have required fields
- [ ] Check timestamps are Firestore Timestamps
- [ ] Look at browser console for Firebase errors

### Search doesn't filter
- [ ] Ensure `users` collection has `email` field
- [ ] Check field names are lowercase
- [ ] Try searching for exact email/name first

### Routes not protected
- [ ] Verify AdminAuthProvider wraps app
- [ ] Check `_layout.tsx` has auth logic
- [ ] Clear sessionStorage and try again
- [ ] Check browser console for errors

### Wrong colors/styling
- [ ] Verify `constants/admin-theme.ts` exists
- [ ] Check color values are correct hex codes
- [ ] Ensure StyleSheet.create() is used
- [ ] Test in different browsers

---

## 📱 Mobile vs Web

This admin panel is optimized for web/tablet screens. For mobile:

### Responsive Considerations
- NavBar may need scroll on small screens
- Table might need horizontal scroll
- Consider reducing padding on mobile

### To optimize for mobile:
1. Add responsive layouts
2. Use viewport height instead of fixed sizes
3. Consider mobile-friendly navigation (drawer/hamburger)

---

## 🔒 Security Notes

### Current Implementation
- ✅ Credentials hardcoded for demo
- ✅ Session expires when browser closes
- ✅ Route protection on client-side
- ✅ No sensitive data in localStorage

### For Production
- ❌ **Do NOT use hardcoded credentials**
- ✅ Implement Firebase Admin SDK authentication
- ✅ Add server-side route protection
- ✅ Use secure session management
- ✅ Add rate limiting on login
- ✅ Log admin actions
- ✅ Add role-based access control (RBAC)

### To Move to Production:
1. Create backend API for admin auth
2. Integrate Firebase Admin SDK
3. Add proper session management
4. Implement audit logging
5. Add IP whitelisting if needed
6. Consider 2FA

---

## 📚 Additional Resources

### Firestore Documentation
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
- [Firestore Timestamps](https://firebase.google.com/docs/firestore/manage-data/data-types#timestamp)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)

### Expo Router
- [Expo Router Docs](https://expo.github.io/router/introduction)
- [File-based Routing](https://expo.github.io/router/file-based-routing)

### React Native
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [StyleSheet API](https://reactnative.dev/docs/stylesheet)

---

## 📞 Support

### Common Questions

**Q: Can I use this with Firebase Auth?**
A: Yes! Modify `admin-auth-context.tsx` to use Firebase Auth instead of hardcoded credentials.

**Q: How do I add more stats cards?**
A: Add new `StatCard` components in `home.tsx` and fetch data in `useEffect`.

**Q: Can I export data?**
A: Yes, add export functionality by fetching all data and using libraries like `react-native-csv` or backend export.

**Q: How do I backup admin data?**
A: Use Firestore backups in Google Cloud Console or export via Firebase Admin SDK.

---

## ✨ Next Steps

1. ✅ Verify all files are created
2. ✅ Set up Firestore collections
3. ✅ Create or import test data
4. ✅ Run `npm start` or `npm run web`
5. ✅ Navigate to `/admin/login`
6. ✅ Test with `admin` / `123`
7. ✅ Explore all screens and features
8. ✅ Read ADMIN_TESTING_CHECKLIST.md for detailed testing

---

**Ready to go! Start your server and access `/admin/login` 🚀**
