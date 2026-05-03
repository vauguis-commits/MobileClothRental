import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DRAWER_WIDTH = Dimensions.get("window").width * 0.75;

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type User = {
  name: string;
  email: string;
};

export default function Drawer({ isOpen, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Load saved user
  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    };
    loadUser();
  }, []);

  // Animate open / close
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    }
  }, [isOpen]);

  const navigate = (path: string) => {
    onClose();
    setTimeout(() => router.push(path as any), 250);
  };

  const handleLogout = async () => {
    onClose();
    setTimeout(async () => {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/auth/login");
    }, 250);
  };

  if (!visible) return null;

  return (
    // This View must cover the whole screen and sit on top
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Dark overlay — tap to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Profile section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || "Guest"}</Text>
          <Text style={styles.userEmail}>{user?.email || ""}</Text>
        </View>

        <View style={styles.divider} />

        {/* Nav items */}
        <View style={styles.navSection}>
          <Text style={styles.navLabel}>BROWSE</Text>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigate("/pages/men/menDashboard")}
          >
            <Text style={styles.navIcon}>👔</Text>
            <Text style={styles.navText}>Men's Collection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigate("/pages/women/womenDashboard")}
          >
            <Text style={styles.navIcon}>👗</Text>
            <Text style={styles.navText}>Women's Collection</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.navSection}>
          <Text style={styles.navLabel}>ACCOUNT</Text>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigate("/pages/profile")}
          >
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigate("/pages/reservations")}
          >
            <Text style={styles.navIcon}>📋</Text>
            <Text style={styles.navText}>My Reservations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigate("/pages/notification")}
          >
            <Text style={styles.navIcon}>🔔</Text>
            <Text style={styles.navText}>Notification</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.navSection}>
          <Text style={styles.navLabel}>MORE INFO</Text>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigate("/pages/about")}
          >
            <Text style={styles.navIcon}>ℹ️</Text>
            <Text style={styles.navText}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigate("/pages/howto")}
          >
            <Text style={styles.navIcon}>❓</Text>
            <Text style={styles.navText}>How to</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigate("/pages/faq")}
          >
            <Text style={styles.navIcon}>🤔</Text>
            <Text style={styles.navText}>FAQ</Text>
          </TouchableOpacity>
        </View>

        {/* Logout pinned to bottom */}
        <View style={styles.footer}>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#fff",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  // Profile
  profileSection: {
    backgroundColor: "#C29E72",
    padding: 20,
    paddingBottom: 24,
    alignItems: "center",
  },
  avatar: {
    marginTop: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3b2314",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  userName: {
    color: "#3b2314",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
  },
  userEmail: { color: "#5a3a1a", fontSize: 12 },

  // Nav
  navSection: { paddingHorizontal: 16, paddingTop: 12 },
  navLabel: {
    fontSize: 10,
    color: "#aaa",
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  navIcon: { fontSize: 18, marginRight: 14 },
  navText: { fontSize: 15, color: "#2b2b2b", fontWeight: "500" },

  // Divider
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
    marginHorizontal: 16,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
  },
  logoutBtn: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  logoutIcon: { fontSize: 18, marginRight: 14 },
  logoutText: { fontSize: 20, color: "#e53e3e", fontWeight: "600" },
});
