import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

function LinkText({ label, to }: { label: string; to: string }) {
  return (
    <Text style={styles.link} onPress={() => Linking.openURL(to).catch(() => {})}>
      {label}
    </Text>
  );
}

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerTitle}>Email para Contato</Text>
      <LinkText label="userkauedias@gmail.com" to="mailto:userkauedias@gmail.com" />

      <View style={styles.spacer} />

      <Text style={styles.footerTitle}>Other projects</Text>
      <View style={styles.linksRow}>
        <View>
          <LinkText label="GitHub" to="https://github.com/kauediaszz" />
        </View>
        <View style={styles.linkSpacer}>
          <LinkText label="LinkedIn" to="https://www.linkedin.com/in/kaue-dias-527405219/" />
        </View>
      </View>

      <Text style={styles.footerText}>© 2025 Dieta I.A. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  footerTitle: {
    fontWeight: '800',
    marginBottom: 4,
  },
  link: {
    color: '#ff0054',
    fontWeight: '700',
    marginBottom: 2,
  },
  spacer: {
    height: 10,
  },
  linksRow: {
    flexDirection: 'row',
  },
  linkSpacer: {
    marginLeft: 18,
  },
  footerText: {
    marginTop: 10,
    color: '#444',
  },
});
