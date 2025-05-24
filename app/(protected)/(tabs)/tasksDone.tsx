import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

type CompletedTask = {
  id: string;
  task: string;
  isCompleted: boolean;
  createdAt: Date;
  userId: string;
};

export default function TasksDoneScreen() {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [allCompletedTasks, setAllCompletedTasks] = useState<CompletedTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const navigation = useNavigation();
  const user = auth().currentUser;
  const colorScheme = useColorScheme();
  
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const borderColor = colorScheme === 'dark' ? '#aaa' : '#999';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={toggleSearchMode}
          style={styles.headerButton}
        >
          <IconSymbol 
            name={isSearchMode ? "list.bullet" : "magnifyingglass"} 
            size={22} 
            color="#007AFF" 
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isSearchMode]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection('tasks')
      .where('userId', '==', user.uid)
      .where('isCompleted', '==', true)
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        if (!querySnapshot) {
          console.log('QuerySnapshot é null');
          return;
        }

        const tasksData: CompletedTask[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          tasksData.push({
            id: doc.id,
            task: data.task,
            isCompleted: data.isCompleted,
            createdAt: data.createdAt.toDate(),
            userId: data.userId
          });
        });
        setAllCompletedTasks(tasksData);
        setCompletedTasks(tasksData);
      });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setCompletedTasks(allCompletedTasks);
    } else {
      const filteredTasks = allCompletedTasks.filter(task =>
        task.task.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCompletedTasks(filteredTasks);
    }
  }, [searchQuery, allCompletedTasks]);

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
    if (isSearchMode) {
      setSearchQuery('');
      setCompletedTasks(allCompletedTasks);
    }
  };

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
          onPress: async () => {
            try {
              await firestore()
                .collection('tasks')
                .doc(taskId)
                .delete();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a tarefa');
              console.error('Erro ao excluir tarefa:', error);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleMarkAsIncomplete = async (taskId: string) => {
    try {
      await firestore()
        .collection('tasks')
        .doc(taskId)
        .update({
          isCompleted: false
        });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível marcar a tarefa como pendente');
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSearchSection = () => {
    if (!isSearchMode) return null;
    
    return (
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { 
              color: textColor,
              borderColor: borderColor
            }
          ]}
          placeholder="Buscar tarefas concluídas..."
          placeholderTextColor={colorScheme === 'dark' ? '#8E8E93' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={[
          styles.searchIcon,
          { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' }
        ]}>
          <IconSymbol 
            name="magnifyingglass" 
            size={20} 
            color={colorScheme === 'dark' ? '#8E8E93' : '#999'} 
          />
        </View>
      </View>
    );
  };

  if (completedTasks.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <ThemedView style={styles.container}>
          {renderSearchSection()}
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol 
              name={isSearchMode ? "magnifyingglass" : "checkmark.circle.fill"} 
              size={60} 
              color="#8E8E93" 
            />
            <ThemedText style={styles.emptyText}>
              {isSearchMode 
                ? (searchQuery.trim() === '' 
                    ? "Digite algo para buscar tarefas concluídas" 
                    : "Nenhuma tarefa concluída encontrada")
                : "Você ainda não tem tarefas concluídas"
              }
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <ThemedView style={styles.container}>
        {renderSearchSection()}
        <FlatList
          style={styles.list}
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedView style={styles.taskItemContainer}>
              <View style={styles.taskContent}>
                <TouchableOpacity 
                  onPress={() => handleMarkAsIncomplete(item.id)}
                  style={styles.checkIconContainer}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="checkmark.circle.fill" size={22} color="#4CD964" />
                </TouchableOpacity>
                <View style={styles.taskTextContainer}>
                  <ThemedText style={styles.taskItem} numberOfLines={2}>
                    {item.task}
                  </ThemedText>
                  <ThemedText style={styles.taskDate}>
                    Criada em {formatDate(item.createdAt)}
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
  headerButton: {
    marginRight: 15,
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
    opacity: 0.8,
  },
  searchIcon: {
    width: 43,
    height: 43,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    opacity: 0.8,
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
    borderWidth: 1,
    borderColor: '#aaa',
    opacity: 0.8,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIconContainer: {
    marginRight: 12,
    padding: 4,
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