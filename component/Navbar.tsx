import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onMenuPress?: () => void;
};

const Navbar = ({ onMenuPress }: Props) => {
  return (
    <View style={styles.container}>
      {/* TOP ROW: Hamburger + Title */}
      <View style={styles.topRow}>
        {/* ☰ MENU BUTTON */}
        <TouchableOpacity onPress={onMenuPress} style={styles.menuBtn}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        {/* TITLE */}
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={styles.title}>SOLEIL LALUNA</Text>
          <Text style={styles.subtitle}>BOUTIQUE</Text>
        </View>

        {/* RIGHT SPACER */}
        <View style={{ width: 40 }} />
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#C29E72",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  menuBtn: {
    width: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  menuIcon: {
    fontSize: 26,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },

  subtitle: {
    fontSize: 10,
    letterSpacing: 3,
  },
});
