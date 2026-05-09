import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import API from "../../services/api";

interface NotificationItem {
  id: string;
  name: string;
  return_time: string;
  status_message: string;
  image: string;
}

export default function Notifications() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const res = await API.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(res?.data?.notifications || []);
    } catch (err: any) {
      console.log("NOTIFICATIONS ERROR:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/100" }}
          style={styles.itemImage}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.itemName}>{item.name}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Return time:</Text>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>{item.return_time}</Text>
            </View>
          </View>

          <Text style={styles.statusText}>{item.status_message}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      <Navbar onMenuPress={() => setSidebarVisible(true)} />

      <Text style={styles.headerTitle}>NOTIFICATION</Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No notifications yet.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 20,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: "#000",
    marginRight: 8,
  },
  timeBadge: {
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 12,
    color: "#000",
  },
  statusText: {
    fontSize: 13,
    color: "#89D64A", // The bright green from the screenshot
    fontWeight: "500",
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  },
});
