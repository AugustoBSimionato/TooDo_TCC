import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-gesture-handler";

// Este layout contém o Drawer e só será carregado para rotas protegidas (após login)
export default function ProtectedLayout() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === "android") {
      require("react-native-gesture-handler");
    }
  }, []);

  const handleLogout = () => {
    // Navegue de volta para a tela de login ao sair
    router.replace("/login");
  };

  return (
    <Drawer
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: true,
        drawerType: "front",
        drawerStyle: {
          width: "70%",
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Tarefas",
          title: "Tarefas",
          drawerIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={22} color={color} />
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
          }
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
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={22} color="#FF3B30" />
          ),
        }}
      />
    </Drawer>
  );
}
