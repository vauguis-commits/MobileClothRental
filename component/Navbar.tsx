import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onMenuPress?: () => void;
  isDrawerOpen?: boolean;
  showBack?: boolean;
};

const Navbar = ({ onMenuPress, isDrawerOpen, showBack }: Props) => {
  const insets = useSafeAreaInsets();

<<<<<<< HEAD
        {/* TITLE */}
        <View style={{ alignItems: "center", flex: 1 }}>
=======
  return (
    <View style={[styles.container, { paddingTop: insets.top + 5 }]}>
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.menuBtn}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onMenuPress} style={styles.menuBtn}>
            <Text style={styles.menuIcon}>{isDrawerOpen ? "✕" : "☰"}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.titleGroup}>
>>>>>>> a8dc11a751f382b6c0c06c6ac9663dc02fa4395c
          <Text style={styles.title}>SOLEIL LALUNA</Text>
          <Text style={styles.subtitle}>BOUTIQUE</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: { backgroundColor: "#C29E72", paddingBottom: 12 },
  topRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15 },
  menuBtn: { width: 40, justifyContent: "center", alignItems: "flex-start" },
  menuIcon: { fontSize: 24, color: "#3b2314", fontWeight: "bold" },
  backIcon: { fontSize: 24, color: "#3b2314", fontWeight: "bold" },
  titleGroup: { flex: 1, alignItems: "center" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
    color: "#3b2314",
  },
  subtitle: { fontSize: 10, letterSpacing: 3, color: "#3b2314" },
});
