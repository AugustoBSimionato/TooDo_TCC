import React from "react";
import { Redirect } from "expo-router";

// Esta é a exportação padrão necessária
export default function TabsIndexScreen() {
  // Redireciona para a tela de tarefas
  return <Redirect href="/(protected)/(tabs)/tasks" />;
}