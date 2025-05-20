import { Redirect } from 'expo-router';
import React from 'react';

// Esta tela nunca deve ser exibida diretamente
// O evento de clique no drawer será interceptado antes
export default function ExitScreen() {
  // Redireciona para a tela principal caso alguém acesse esta tela diretamente
  return <Redirect href="/" />;
}