import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Navbar from "../../../component/Navbar";
import Sidebar from "../../../component/Sidebar";
import API, { BASE_URL } from "../../../services/api";

type Product = {
  id: number;
  image: string;
  item_name: string;
  rental_fee: number;
};

const MenDashboard = () => {
  const [tux, setTux] = useState<Product[]>([]);
  const [prom, setProm] = useState<Product[]>([]);

  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await API.get("/men");
        setTux(res.data.tux || []);
        setProm(res.data.prom || []);
      } catch (err) {
        console.log("Failed to load men dashboard:", err);
      }
    };

    loadData();
  }, []);

  const formatPrice = (price: number) => {
    return Number(price || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const productImage = (image: string) => {
    return image
      ? `${BASE_URL}/storage/${image}`
      : `${BASE_URL}/images/hfhmn.jpg`;
  };

  const renderProduct = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.product}
      onPress={() =>
        router.push(`/pages/product/productDetails?id=${product.id}` as any)
      }
    >
      <Image
        source={{ uri: productImage(product.image) }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name} numberOfLines={1}>
        {product.item_name}
      </Text>
      <Text style={styles.price}>₱{formatPrice(product.rental_fee)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ SIDEBAR */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <ScrollView style={styles.container}>
        {/* NAVBAR */}
        <Navbar onMenuPress={() => setSidebarVisible(true)} />

        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: `${BASE_URL}/images/banner-men.png` }}
            style={styles.banner}
          />
          <View style={styles.tabsOverlay}>
            <View style={styles.tabsPill}>
              <TouchableOpacity
                style={[styles.tab, styles.activeTab]}
                onPress={() => router.push("/pages/men/menDashboard" as any)}
              >
                <Text style={styles.activeTabText}>MEN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => router.push("/pages/women/womenDashboard" as any)}
              >
                <Text style={styles.tabText}>WOMEN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.title}>TUXEDO & SUITS</Text>
            <TouchableOpacity
              onPress={() => router.push("/pages/men/menTuxedo" as any)}
            >
              <Text style={styles.viewMore}>view more</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>{tux.slice(0, 6).map(renderProduct)}</View>
        </View>

        <View style={[styles.section, { marginBottom: 30 }]}>
          <View style={styles.header}>
            <Text style={styles.title}>PROM & STYLES</Text>
            <TouchableOpacity
              onPress={() => router.push("/pages/men/menProm" as any)}
            >
              <Text style={styles.viewMore}>view more</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>{prom.slice(0, 6).map(renderProduct)}</View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MenDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  banner: { width: "100%", height: 180, resizeMode: "cover" },
  section: { marginTop: 20, paddingHorizontal: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  viewMore: { color: "blue" },
  row: { flexDirection: "row", flexWrap: "wrap" },
  product: {
    width: "45%",
    margin: 5,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  image: { width: "100%", height: 120, borderRadius: 8 },
  name: { marginTop: 5, fontSize: 12, color: "#444" },
  price: { marginTop: 2, fontWeight: "bold" },

  bannerContainer: {
    position: "relative",
  },
  tabsOverlay: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  tabsPill: {
    flexDirection: "row",
    backgroundColor: "rgba(238,238,238,0.88)",
    borderRadius: 20,
    overflow: "hidden",
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  activeTab: {
    backgroundColor: "#d6b37a",
  },
  tabText: { color: "#333", fontWeight: "600" },
  activeTabText: { color: "#000", fontWeight: "700" },
});
