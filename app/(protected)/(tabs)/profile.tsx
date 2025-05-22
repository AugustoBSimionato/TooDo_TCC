import React, { useEffect, useState } from 'react';
import { 
  Alert, 
  StyleSheet, 
  Text, 
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import auth from '@react-native-firebase/auth';

export default function ProfileScreen() {
  const [user, setUser] = useState(auth().currentUser);
  const [email, setEmail] = useState(user?.email || '');
  
  useEffect(() => {
    // Atualiza os dados do usuário caso mudem
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email || '');
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  const lastSignInTime = user?.metadata?.lastSignInTime 
    ? new Date(user.metadata.lastSignInTime).toLocaleString() 
    : 'Desconhecido';
  
  const creationTime = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleString() 
    : 'Desconhecido';
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(email?.charAt(0) || '?').toUpperCase()}
            </Text>
          </View>
        </ThemedView>
        
        <ThemedView style={styles.infoContainer}>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Email:</ThemedText>
            <ThemedText style={styles.infoValue}>{email}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Último login:</ThemedText>
            <ThemedText style={styles.infoValue}>{lastSignInTime}</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Conta criada em:</ThemedText>
            <ThemedText style={styles.infoValue}>{creationTime}</ThemedText>
          </ThemedView>
        </ThemedView>
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  infoContainer: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoLabel: {
    width: '40%',
    fontWeight: '600',
    fontSize: 16,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
  }
});