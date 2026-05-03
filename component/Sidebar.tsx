import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const Sidebar = ({ visible, onClose }: Props) => {
  if (!visible) return null;

  const Item = (label: string, route?: string) => (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          onClose();
          if (route) router.push(route as any);
        }}
      >
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
      <View style={styles.line} />
    </>
  );

  return (
    <View style={styles.overlay}>
      <View style={styles.sidebar}>
        {/* MENU ITEMS */}
        {Item("Men", "/pages/men/menDashboard")}
        {Item("Women", "/pages/women/womenDashboard")}
        {Item("About", "/pages/About")}
        {Item("How to", "/pages/howto")}
        {Item("FAQ", "/pages/Faq")}
        {Item("Profile", "/pages/Profile")}
        {Item("Rented Items", "/pages/RentedItems")}
        {Item("Notifications", "/pages/Notifications")}
      </View>

      {/* click outside to close */}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  overlay: {
    marginTop: 82, // ✅ PUSH BELOW NAVBAR
    position: "absolute",
    width: "100%",
    height: "95%",
    flexDirection: "row",
    zIndex: 100,
  },

  sidebar: {
    width: 200, // ⬅️ little wider for navbar
    backgroundColor: "#C29E72",
  },

  item: {
    marginTop: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },

  text: {
    fontSize: 16,
    fontWeight: "500",
  },

  line: {
    height: 1,
    backgroundColor: "#0b0b0b",
    marginHorizontal: 20,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
