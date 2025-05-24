import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import auth from '@react-native-firebase/auth';
import { FirebaseError } from 'firebase/app';

const RecoverPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleRecoverPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor preencha o campo de email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Verifique seu Email', 
        'Se uma conta com este email existir, um link para redefinição de senha foi enviado.'
      );
      router.replace('/login');
    } catch (e: any) {
      const err = e as FirebaseError;
      Alert.alert('Erro', 'Não foi possível enviar o email de recuperação: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[
      styles.safeArea,
      { backgroundColor: colorScheme === 'dark' ? 'rgba(41, 41, 41, 0.5)' : '#ffffff' }
    ]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={colorScheme === 'dark' ? '#FFFFFF' : '#3498db'} 
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[
          styles.container,
          { backgroundColor: colorScheme === 'dark' ? 'rgba(21, 21, 21, 0.5)' : '#ffffff' }
        ]}>
        <View style={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>TooDo</Text>
            <Text style={[
              styles.tagline,
              { color: colorScheme === 'dark' ? '#CCCCCC' : '#7f8c8d' }
            ]}>Recupere sua senha</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={[
              styles.label,
              { color: colorScheme === 'dark' ? '#CCCCCC' : '#999' }
            ]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#f5f6fa',
                  borderColor: colorScheme === 'dark' ? '#48484A' : '#dcdde1',
                  color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
                }
              ]}
              placeholder="Digite o email da sua conta"
              placeholderTextColor={colorScheme === 'dark' ? '#8E8E93' : '#A0A0A0'}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TouchableOpacity
              style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
              onPress={handleRecoverPassword}
              disabled={isLoading}>
              <Text style={styles.actionButtonText}>
                {isLoading ? 'Enviando...' : 'Recuperar senha'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3498db',
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  actionButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLoginContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  backToLoginLink: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RecoverPasswordScreen;