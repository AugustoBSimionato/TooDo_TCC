import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import "react-native-gesture-handler";

import auth from "@react-native-firebase/auth";

export default function ProtectedLayout() {
  const router = useRouter();

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        router.replace("/login");
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
        router.replace("/login");
      });
  };

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerType: "front",
        drawerStyle: {
          width: "70%",
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { height: 0 },
          drawerLabel: () => null,
        }}
      />

      <Drawer.Screen
        name="tasks"
        options={{
          drawerLabel: "Tarefas",
          title: "Tarefas",
          drawerIcon: ({ color }) => (
            <IconSymbol name="list.bullet" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="tasksDone"
        options={{
          drawerLabel: "Tarefas Concluídas",
          title: "Tarefas Concluídas",
          drawerIcon: ({ color }) => (
            <IconSymbol name="checkmark.circle.fill" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: "Perfil",
          title: "Meu Perfil",
          drawerIcon: ({ color }) => (
            <IconSymbol name="person.fill" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: "Sobre o App",
          title: "Sobre o TooDo",
          drawerIcon: ({ color }) => (
            <IconSymbol name="info.circle.fill" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="exit"
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
        options={{
          drawerLabel: "Sair",
          title: "Sair",
          headerShown: false,
          drawerLabelStyle: {
            color: "#FF3B30",
            fontWeight: "500",
          },
          drawerIcon: ({ color }) => (
            <IconSymbol
              name="rectangle.portrait.and.arrow.right"
              size={22}
              color="#FF3B30"
            />
          ),
        }}
      />
    </Drawer>
  );
}
