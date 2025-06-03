import { Stack } from "expo-router";
import React from "react";

export default function ProtectedLayout() {
  return (
    <Stack>
      {/* A rota (tabs) será exibida sem cabeçalho */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Outras telas no grupo protegido */}
      <Stack.Screen name="profile" options={{ title: "Perfil" }} />
      <Stack.Screen name="about" options={{ title: "Sobre" }} />
      {/* <Stack.Screen name="settings" options={{ title: "Configurações" }} /> */}
    </Stack>
  );
}