import { useAdminAuth } from '@/contexts/admin-auth-context';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function AdminLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    const success = login(username, password);
    setLoading(false);

    if (success) {
      router.replace('/admin/home');
    } else {
      setError('Usuário ou senha incorretos');
      setPassword('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.logo}>Dieta I.A.</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Admin</Text>
                </View>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Username Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Usuário</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Usuário"
                    placeholderTextColor="#8b949e"
                    value={username}
                    onChangeText={setUsername}
                    editable={!loading}
                  />
                </View>

                {/* Password Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Senha</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Senha"
                      placeholderTextColor="#8b949e"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      <Text style={styles.eyeIcon}>
                        {showPassword ? '👁' : '👁‍🗨'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                 
                </View>

                {/* Error Message */}
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#161b22',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#30363d',
    width: '100%',
    maxWidth: 400,
    padding: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e6edf3',
    marginBottom: 8,
    fontFamily: 'DM Sans',
  },
  badge: {
    backgroundColor: '#58a6ff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 7,
  },
  badgeText: {
    color: '#0d1117',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  form: {
    gap: 20,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8b949e',
    fontFamily: 'DM Sans',
  },
  input: {
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e6edf3',
    fontSize: 14,
    fontFamily: 'DM Sans',
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 44,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#58a6ff',
    borderRadius: 7,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0d1117',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  errorText: {
    color: '#f85149',
    fontSize: 13,
    fontFamily: 'DM Sans',
    marginTop: -8,
  },
  footer: {
    color: '#8b949e',
    fontSize: 12,
    marginTop: 20,
    fontFamily: 'DM Sans',
  },
});
