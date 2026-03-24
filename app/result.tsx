import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useDiet } from '@/contexts/diet-context';

function SummaryCard({
  title,
  value,
  suffix = '',
}: {
  title: string;
  value: string | number | null;
  suffix?: string;
}) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={styles.summaryValue}>
        {value === null || value === undefined ? '--' : value}
        {suffix}
      </Text>
    </View>
  );
}

export default function ResultScreen() {
  const { resultadoFinal } = useDiet();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.h1}>Resultado Metabolico</Text>

        {!resultadoFinal ? (
          <Text style={styles.loading}>Carregando...</Text>
        ) : (
          <View style={styles.summaryCards}>
            <SummaryCard title="IMC" value={resultadoFinal.imc} />
            <SummaryCard title="Gasto Calorico Diario" value={resultadoFinal.tdee} suffix=" kcal" />
          </View>
        )}

        <View style={styles.dietaAviso}>
          <Text style={styles.dietaAvisoText}>
            🚧 Em breve a Inteligencia Artificial ira gerar sua dieta personalizada automaticamente.
          </Text>
        </View>

        <TouchableOpacity style={styles.resultBtn} onPress={() => router.push('/')} activeOpacity={0.9}>
          <Text style={styles.resultBtnText}>Refazer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 26,
  },
  container: {
    paddingHorizontal: 14,
    paddingTop: 18,
  },
  h1: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    color: '#05121a',
  },
  loading: {
    fontSize: 16,
    color: '#444',
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 12,
    elevation: 1,
  },
  summaryTitle: {
    fontWeight: '900',
    color: '#ff0054',
    marginBottom: 6,
  },
  summaryValue: {
    fontWeight: '900',
    fontSize: 18,
    color: '#05121a',
  },
  dietaAviso: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  dietaAvisoText: {
    color: '#24323f',
    fontWeight: '700',
    lineHeight: 22,
  },
  resultBtn: {
    marginTop: 16,
    backgroundColor: '#ff0054',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  resultBtnText: {
    fontWeight: '900',
    color: '#fff',
  },
});
