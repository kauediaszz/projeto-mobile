import { subscribeToUserCount, subscribeTodietCount } from '@/services/firebase-stats';
import { FirebaseUser, subscribeToUsers } from '@/services/firebase-users';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface StatCard {
  title: string;
  value: number;
  loading: boolean;
}

export default function AdminHomeScreen() {
  const [stats, setStats] = useState<{
    users: StatCard;
    diets: StatCard;
  }>({
    users: { title: 'Usuários registrados', value: 0, loading: true },
    diets: { title: 'Dietas geradas', value: 0, loading: true },
  });

  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      users: { ...prev.users, loading: true },
    }));

    const unsubscribe = subscribeToUserCount(
      (count) => {
        setStats(prev => ({
          ...prev,
          users: { ...prev.users, value: count, loading: false },
        }));
      },
      (error) => {
        console.error('Error fetching user count:', error);
        setStats(prev => ({
          ...prev,
          users: { ...prev.users, loading: false },
        }));
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      diets: { ...prev.diets, loading: true },
    }));

    const unsubscribe = subscribeTodietCount(
      (count) => {
        setStats(prev => ({
          ...prev,
          diets: { ...prev.diets, value: count, loading: false },
        }));
      },
      (error) => {
        console.error('Error fetching diet count:', error);
        setStats(prev => ({
          ...prev,
          diets: { ...prev.diets, loading: false },
        }));
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setActivitiesLoading(true);

    const unsubscribe = subscribeToUsers(
      (fetchedUsers) => {
        setUsers(fetchedUsers);
        setActivitiesLoading(false);
      },
      (error) => {
        console.error('Error fetching users for activities:', error);
        setActivitiesLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>A</Text>
        </View>
        <View style={styles.welcomeText}>
          <Text style={styles.greeting}>Olá, Admin 👋</Text>
          <Text style={styles.subtitle}>
            Painel de controle · Dieta I.A.
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title={stats.users.title}
          value={stats.users.value}
          loading={stats.users.loading}
        />
        <StatCard
          title={stats.diets.title}
          value={stats.diets.value}
          loading={stats.diets.loading}
        />
      </View>

      {/* Recent Users Activity */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Usuários recentes</Text>

        {activitiesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#58a6ff" size="large" />
          </View>
        ) : (
          <View style={styles.activityList}>
            {users.length > 0 ? (
              users.slice(0, 5).map((user) => (
                <View key={user.id} style={styles.activityItem}>
                  <Text style={styles.activityIcon}>👤</Text>
                  <View style={styles.activityContent}>
                    <View>
                      <Text style={styles.activityTitle}>
                        {user.name || user.lowercaseName}
                      </Text>
                      <Text style={styles.activityEmail}>
                        {user.email}
                      </Text>
                    </View>
                    <Text style={styles.activityTime}>
                      UID: {user.uid.substring(0, 12)}...
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeDietText}>
                      Ativo
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  loading: boolean;
}

function StatCard({ title, value, loading }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      {loading ? (
        <ActivityIndicator color="#58a6ff" />
      ) : (
        <Text style={styles.statValue}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    padding: 24,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#58a6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0d1117',
    fontFamily: 'DM Sans',
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e6edf3',
    fontFamily: 'DM Sans',
  },
  subtitle: {
    fontSize: 14,
    color: '#8b949e',
    marginTop: 4,
    fontFamily: 'DM Sans',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTitle: {
    fontSize: 13,
    color: '#8b949e',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#58a6ff',
    fontFamily: 'DM Sans',
  },
  activitySection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e6edf3',
    marginBottom: 16,
    fontFamily: 'DM Sans',
  },
  activityList: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 10,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    gap: 12,
  },
  activityItem_last: {
    borderBottomWidth: 0,
  },
  activityIcon: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e6edf3',
    fontFamily: 'DM Sans',
  },
  activityEmail: {
    fontSize: 12,
    color: '#8b949e',
    marginTop: 2,
    fontFamily: 'DM Sans',
  },
  activityTime: {
    fontSize: 12,
    color: '#8b949e',
    fontFamily: 'DM Sans',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  badgeDiet: {
    backgroundColor: 'rgba(88, 166, 255, 0.2)',
  },
  badgeRegistration: {
    backgroundColor: 'rgba(139, 148, 158, 0.2)',
  },
  badgeDietText: {
    color: '#58a6ff',
  },
  badgeRegistrationText: {
    color: '#8b949e',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  loadingContainer: {
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    padding: 16,
    color: '#8b949e',
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },
});
