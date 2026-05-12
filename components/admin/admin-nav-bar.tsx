import { useAdminAuth } from '@/contexts/admin-auth-context';
import { router, usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminNavBar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
    router.replace('/admin/login');
  };

  return (
    <View style={styles.navbar}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Text style={styles.logo}>Dieta I.A.</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Admin</Text>
        </View>
      </View>

     

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

interface NavButtonProps {
  label: string;
  path: string;
  active: boolean;
  onPress: () => void;
}




const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#0d1117',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 150,
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e6edf3',
    fontFamily: 'DM Sans',
  },
  badge: {
    backgroundColor: '#58a6ff',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  badgeText: {
    color: '#0d1117',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
    marginHorizontal: 32,
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  navButtonActive: {
    backgroundColor: '#1c2128',
    borderColor: '#30363d',
  },
  navButtonText: {
    color: '#8b949e',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'DM Sans',
  },
  navButtonTextActive: {
    color: '#e6edf3',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  logoutText: {
    color: '#e6edf3',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'DM Sans',
  },
});
