import React, { useState } from 'react';
import {
    Alert,
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (value: string) => {
    const regex = /^(?=.*[0-9])(?=.*[!@\$%]).{8,16}$/;
    return regex.test(value);
  };

  const onSubmit = () => {
    const cleanEmail = email.trim();
    const cleanName = name.trim();
    if (!cleanEmail.includes('@')) {
      Alert.alert('Email invalido', 'Digite um email valido.');
      return;
    }
    if (cleanName.length < 2) {
      Alert.alert('Nome invalido', 'Digite seu nome.');
      return;
    }
    if (!password || !validatePassword(password)) {
      Alert.alert('Senha invalida', 'A senha deve ter 8-16 caracteres, incluir ao menos um número e um caractere especial (!@$%).');
      return;
    }
    Alert.alert('Registrado!', 'Email enviado com sucesso!');
    setEmail('');
    setName('');
    setPassword('');
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
              <Text style={styles.title}>Se registre ja</Text>
              <Text style={styles.subtitle}>
                Informe seu email para receber gratis sua dieta por email pela Dieta I.A.
              </Text>

              <View style={styles.form}>
                <Text style={styles.label}>Digite seu email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />

                <Text style={styles.label}>Digite como devemos te chamar</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Nome"
                  autoCapitalize="words"
                  style={styles.input}
                />

                <Text style={styles.label}>Senha</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative', marginBottom: 16 }}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="8-16 caracteres, com número e caractere especial (!@$%)"
                    secureTextEntry={!showPassword}
                    style={[styles.input, { flex: 1, marginBottom: 0, paddingRight: 40 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12 }}
                  >
                    <Text style={{ fontSize: 18 }}>
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.btnWrap}>
                  <Button title="Register" onPress={onSubmit} color="#ff0054" />
                </View>
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
    justifyContent: 'center',
    paddingVertical: 14,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#444',
    marginBottom: 12,
  },
  form: {},
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#222',
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  btnWrap: {
    marginTop: 6,
  },
});
