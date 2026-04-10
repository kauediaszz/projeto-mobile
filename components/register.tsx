import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

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
    Alert.alert('Registrado!', 'Email enviado com sucesso!');
    setEmail('');
    setName('');
  };

  return (
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

          <View style={styles.btnWrap}>
            <Button title="Register" onPress={onSubmit} color="#ff0054" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
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
