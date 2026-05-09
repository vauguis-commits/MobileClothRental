import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
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

const SECTION_H_PAD = 12;
const ITEM_GAP = 8;
const COLS = 2;
const { width: SCREEN_W } = Dimensions.get("window");
const ITEM_SIZE =
  (SCREEN_W - SECTION_H_PAD * 2 - ITEM_GAP * (COLS - 1)) / COLS;

const WomenDashboard = () => {
  const [wedding, setWedding] = useState<Product[]>([]);
  const [prom, setProm] = useState<Product[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await API.get("/women");
        setWedding(res.data.wedding || []);
        setProm(res.data.prom || []);
      } catch (err) {
        console.log("Failed to load women dashboard:", err);
      }
    };
    loadData();
  }, []);

  const formatPrice = (price: number) =>
    Number(price || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const productImage = (image: string) =>
    image ? `${BASE_URL}/storage/${image}` : `${BASE_URL}/images/hfhmn.jpg`;

  const renderProduct = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        router.push(`/pages/product/productDetails?id=${product.id}` as any)
      }
    >
      <Image
        source={{ uri: productImage(product.image) }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.priceStrip}>
        <Text style={styles.priceText} numberOfLines={1}>
          ₱{formatPrice(product.rental_fee)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderGrid = (items: Product[]) => {
    const limited = items.slice(0, COLS * 2);
    const rows: Product[][] = [];
    for (let i = 0; i < limited.length; i += COLS) {
      rows.push(limited.slice(i, i + COLS));
    }
    return rows.map((row, ri) => (
      <View key={ri} style={styles.row}>
        {row.map(renderProduct)}
      </View>
    ));
  };

  return (
    <View style={{ flex: 1 }}>
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      <ScrollView style={styles.container}>
        <Navbar onMenuPress={() => setSidebarVisible(true)} />

        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: `${BASE_URL}/images/banner-women.png` }}
            style={styles.banner}
          />
          <View style={styles.tabsOverlay}>
            <View style={styles.tabsPill}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => router.push("/pages/men/menDashboard" as any)}
              >
                <Text style={styles.tabText}>MEN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, styles.activeTab]}
                onPress={() => router.push("/pages/women/womenDashboard" as any)}
              >
                <Text style={styles.activeTabText}>WOMEN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>WEDDING GOWNS</Text>
            <TouchableOpacity onPress={() => router.push("/pages/women/womenWedding" as any)}>
              <Text style={styles.viewMore}>view more</Text>
            </TouchableOpacity>
          </View>
          {renderGrid(wedding)}
        </View>

        <View style={[styles.section, { marginBottom: 30 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PROM & STYLES</Text>
            <TouchableOpacity onPress={() => router.push("/pages/women/womenProm" as any)}>
              <Text style={styles.viewMore}>view more</Text>
            </TouchableOpacity>
          </View>
          {renderGrid(prom)}
        </View>
      </ScrollView>
    </View>
  );
};

export default WomenDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

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
  activeTab: { backgroundColor: "#d6b37a" },
  tabText: { color: "#333", fontWeight: "600" },
  activeTabText: { color: "#000", fontWeight: "700" },

  banner: { width: "100%", height: 180 },

  section: { marginTop: 20, paddingHorizontal: SECTION_H_PAD },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "900", letterSpacing: 0.5 },
  viewMore: { fontSize: 13, color: "#0055cc", textDecorationLine: "underline" },

  row: {
    flexDirection: "row",
    gap: ITEM_GAP,
    marginBottom: ITEM_GAP,
  },

  card: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  priceStrip: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#9BC67C",
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  priceText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 13,
  },
});
