import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

type MenuItem = {
  label: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const MENU: MenuItem[] = [
  { label: "Men", route: "/pages/men/menDashboard", icon: "man-outline" },
  {
    label: "Women",
    route: "/pages/women/womenDashboard",
    icon: "woman-outline",
  },
  { label: "About", route: "/pages/About", icon: "information-circle-outline" },
  { label: "How To", route: "/pages/howto", icon: "help-circle-outline" },
  { label: "FAQ", route: "/pages/Faq", icon: "chatbubble-ellipses-outline" },
  { label: "Profile", route: "/pages/Profile", icon: "person-circle-outline" },
];

const Sidebar = ({ visible, onClose }: Props) => {
  if (!visible) return null;

  const handleNav = (route: string) => {
    onClose();
    router.push(route as any);
  };

  return (
    <View style={s.overlay}>
      <View style={s.drawer}>
        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.logoMark}>
            <Ionicons name="shirt-outline" size={26} color="#C29E72" />
          </View>
          <Text style={s.brandName}>SOLEIL LALUNA</Text>
          <Text style={s.brandSub}>BOUTIQUE</Text>
        </View>

        <View style={s.divider} />

        {/* ── Menu items ── */}
        <View style={s.menu}>
          {MENU.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={s.item}
              activeOpacity={0.7}
              onPress={() => handleNav(item.route)}
            >
              <View style={s.iconBox}>
                <Ionicons name={item.icon} size={22} color="#C29E72" />
              </View>
              <Text style={s.itemLabel}>{item.label}</Text>
              <Ionicons
                name="chevron-forward-outline"
                size={16}
                color="#ffffff"
                style={s.chevron}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* backdrop */}
      <TouchableOpacity
        style={s.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />
    </View>
  );
};

export default Sidebar;

const s = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 200,
  },

  drawer: {
    width: 240,
    backgroundColor: "#5a3e1c",
    paddingTop: 80,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 16,
  },

  // header
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 4,
  },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(194,158,114,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(194,158,114,0.3)",
  },
  brandName: {
    color: "#F5EDE0",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2.5,
  },
  brandSub: {
    color: "#C29E72",
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 20,
    marginBottom: 10,
  },

  // menu
  menu: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(194,158,114,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    flex: 1,
    color: "#EDE0D0",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  chevron: {
    opacity: 0.4,
  },

  // footer
  footer: {
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 20,
  },
  footerText: {
    color: "#6B5040",
    fontSize: 11,
    fontStyle: "italic",
    letterSpacing: 1,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
});
