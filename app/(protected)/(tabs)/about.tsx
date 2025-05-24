import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <ThemedView style={styles.container}>
        <Image 
          source={require('../../../assets/images/toodo-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText style={styles.title}>TooDo App</ThemedText>
        <ThemedText style={styles.version}>Versão 1.0.0</ThemedText>
        <ThemedText style={styles.description}>
          Um aplicativo simples e eficiente para gerenciamento de tarefas,
          desenvolvido como projeto de TCC.
        </ThemedText>
        <ThemedText style={styles.copyright}>{new Date().getFullYear()} Augusto Simionato</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.6,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: '80%',
  },
  copyright: {
    fontSize: 14,
    opacity: 0.5,
    position: 'absolute',
    bottom: 20,
  },
});