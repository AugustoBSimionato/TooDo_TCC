import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Tipo para tarefas concluídas
type CompletedTask = {
  id: string;
  title: string;
  completedAt: Date;
};

export default function TasksDoneScreen() {
  // Estado para armazenar tarefas concluídas (mock data por enquanto)
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([
    { id: '1', title: 'Finalizar relatório', completedAt: new Date(2023, 4, 15, 14, 30) },
    { id: '2', title: 'Comprar mantimentos', completedAt: new Date(2023, 4, 14, 10, 15) },
    { id: '3', title: 'Academia', completedAt: new Date(2023, 4, 13, 18, 45) },
    { id: '4', title: 'Ler capítulo do livro', completedAt: new Date(2023, 4, 12, 21, 20) },
    { id: '5', title: 'Enviar e-mail para cliente', completedAt: new Date(2023, 4, 11, 9, 0) },
  ]);

  // Função para excluir tarefa
  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Excluir tarefa',
      'Tem certeza que deseja excluir esta tarefa concluída?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          onPress: () => {
            // Remove a tarefa da lista
            setCompletedTasks(tasks => tasks.filter(task => task.id !== taskId));
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Formata a data para exibição
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Se não houver tarefas concluídas, mostra mensagem
  if (completedTasks.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <ThemedView style={styles.emptyContainer}>
          <IconSymbol name="checkmark.circle.fill" size={60} color="#8E8E93" />
          <ThemedText style={styles.emptyText}>
            Você ainda não tem tarefas concluídas
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <ThemedView style={styles.container}>
        <FlatList
          style={styles.list}
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedView style={styles.taskItemContainer}>
              <View style={styles.taskContent}>
                <View style={styles.checkIconContainer}>
                  <IconSymbol name="checkmark.circle.fill" size={22} color="#4CD964" />
                </View>
                <View style={styles.taskTextContainer}>
                  <ThemedText style={styles.taskItem} numberOfLines={1}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.taskDate}>
                    Concluída em {formatDate(item.completedAt)}
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteTask(item.id)}
                style={styles.deleteButton}
                activeOpacity={0.7}
              >
                <IconSymbol name="trash.fill" size={22} color="#FF3B30" />
              </TouchableOpacity>
            </ThemedView>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  taskItemContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIconContainer: {
    marginRight: 12,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskItem: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskDate: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.6,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.6,
  },
});