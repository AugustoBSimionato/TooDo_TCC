import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

type Task = {
  id: string;
  task: string;
  isCompleted: boolean;
  createdAt: Date;
  userId: string;
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const navigation = useNavigation();
  const user = auth().currentUser;
  const colorScheme = useColorScheme();
  
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const borderColor = colorScheme === 'dark' ? '#aaa' : '#999';

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={toggleSearchMode}
          style={styles.headerButton}
        >
          <IconSymbol 
            name={isSearchMode ? "plus.app" : "magnifyingglass"} 
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
      .where('isCompleted', '==', false)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          if (!querySnapshot) {
            console.log('QuerySnapshot é null');
            return;
          }

          const tasksData: Task[] = [];
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
          setAllTasks(tasksData);
          setTasks(tasksData);
        },
        error => {
          console.error('Erro ao carregar tarefas:', error);
          Alert.alert('Erro', 'Não foi possível carregar as tarefas');
        }
      );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setTasks(allTasks);
    } else {
      const filteredTasks = allTasks.filter(task =>
        task.task.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTasks(filteredTasks);
    }
  }, [searchQuery, allTasks]);

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
    if (isSearchMode) {
      setSearchQuery('');
      setTasks(allTasks);
    }
    setNewTask('');
  };

  const addTask = async () => {
    if (newTask.trim().length === 0 || !user) return;

    setIsLoading(true);
    try {
      await firestore().collection('tasks').add({
        task: newTask.trim(),
        isCompleted: false,
        createdAt: firestore.Timestamp.now(),
        userId: user.uid
      });
      setNewTask('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa');
      console.error('Erro ao adicionar tarefa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      await firestore()
        .collection('tasks')
        .doc(taskId)
        .update({
          isCompleted: true
        });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível marcar a tarefa como concluída');
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    Alert.alert(
      'Excluir tarefa',
      'Tem certeza que deseja excluir esta tarefa?',
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

  const renderInputSection = () => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          { 
            color: textColor,
            borderColor: borderColor
          }
        ]}
        placeholder={isSearchMode ? "Buscar tarefas..." : "Digite uma nova tarefa..."}
        placeholderTextColor={colorScheme === 'dark' ? '#8E8E93' : '#999'}
        value={isSearchMode ? searchQuery : newTask}
        onChangeText={isSearchMode ? setSearchQuery : setNewTask}
      />
      {!isSearchMode && (
        <TouchableOpacity 
          style={[styles.addButton, isLoading && styles.addButtonDisabled]} 
          onPress={addTask}
          disabled={isLoading}
        >
          <ThemedText style={styles.addButtonText}>+</ThemedText>
        </TouchableOpacity>
      )}
      {isSearchMode && (
        <TouchableOpacity 
          style={[
            styles.searchIcon,
            { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' }
          ]}
          onPress={() => {}}
        >
          <IconSymbol 
            name="magnifyingglass" 
            size={20} 
            color={colorScheme === 'dark' ? '#8E8E93' : '#999'} 
          />
        </TouchableOpacity>
      )}
    </View>
  );

  if (tasks.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <ThemedView style={styles.container}>
          {renderInputSection()}
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol 
              name={isSearchMode ? "magnifyingglass" : "list.bullet"} 
              size={60} 
              color="#8E8E93" 
            />
            <ThemedText style={styles.emptyText}>
              {isSearchMode 
                ? (searchQuery.trim() === '' 
                    ? "Digite algo para buscar tarefas" 
                    : "Nenhuma tarefa encontrada")
                : "Você não tem tarefas pendentes"
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
        {renderInputSection()}
        <FlatList
          style={styles.list}
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedView style={styles.taskItemContainer}>
              <View style={styles.taskContent}>
                <TouchableOpacity 
                  onPress={() => toggleTaskCompletion(item.id)}
                  style={styles.checkButton}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="circle" size={22} color="#007AFF" />
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
                onPress={() => deleteTask(item.id)}
                style={styles.deleteButton}
                activeOpacity={0.7}
              >
                <IconSymbol name="trash.fill" size={22} color="#FF3B30" />
              </TouchableOpacity>
            </ThemedView>
          )}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
    opacity: 0.8,
  },
  addButton: {
    width: 43,
    height: 43,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 28,
    color: 'white',
    lineHeight: 28,
    textAlign: 'center',
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
  checkButton: {
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