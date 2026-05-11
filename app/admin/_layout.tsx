import { useAdminAuth } from '@/contexts/admin-auth-context';
import { router, Slot, usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function AdminLayout() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, pathname]);

  // Show nothing while checking authentication
  if (isLoading) {
    return <View style={styles.loadingContainer} />;
  }

  // For login page, don't show navbar
  if (pathname === '/admin/login') {
    return (
      <View style={styles.container}>
        <Slot />
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  content: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
});
