import { useColorScheme } from "@/hooks/useColorScheme";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const router = useRouter();
  const segments = useSegments();

  const colorScheme = useColorScheme();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log("User: ", user);
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inProtectedGroup = segments[0] === "(protected)";

    if (user && !inProtectedGroup) {
      router.replace("/(protected)/(tabs)/tasks");
    } else if (!user && inProtectedGroup) {
      router.replace("/");
    }
  }, [user, initializing]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="recoverPassword" />
          <Stack.Screen
            name="(protected)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" hidden={false} />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
