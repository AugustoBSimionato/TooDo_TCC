import { Stack } from "expo-router";
import React from "react";

export default function ProtectedLayout() {
  // Este componente define o layout para todas as rotas protegidas
  // Ele usa um componente Stack do expo-router para gerenciar navegação
  return (
    <Stack>
      {/* A rota (tabs) será exibida sem cabeçalho */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Outras telas no grupo protegido */}
      <Stack.Screen name="profile" options={{ title: "Perfil" }} />
      <Stack.Screen name="about" options={{ title: "Sobre" }} />
      <Stack.Screen name="settings" options={{ title: "Configurações" }} />
    </Stack>
  );
}