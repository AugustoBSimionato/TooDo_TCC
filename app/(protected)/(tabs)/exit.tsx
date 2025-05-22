import auth from '@react-native-firebase/auth';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';

export default function ExitScreen() {
  useEffect(() => {
    auth().signOut().catch(error => {
      console.error("Erro ao fazer logout:", error);
    });
  }, []);

  return <Redirect href="/login" />;
}