import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />

        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />

        <Stack.Screen
          name="pages/men/menDashboard"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pages/men/menTuxedo"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pages/men/menProm"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pages/women/womenDashboard"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pages/women/womenProm"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pages/women/womenWedding"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pages/product/productDetails"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
