import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Drawer from "../../../component/Drawer";
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadData = async () => {
    setError("");
    try {
      const res = await API.get("/men");
      setTux(res.data.tux || []);
      setProm(res.data.prom || []);
    } catch {
      setError("Failed to load products. Pull down to try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

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

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b2314" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>⚠ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Main ─────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1 }}>
<<<<<<< HEAD
      {/* ✅ SIDEBAR */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <ScrollView style={styles.container}>
        {/* NAVBAR */}
        <Navbar onMenuPress={() => setSidebarVisible(true)} />

        {/* MEN / WOMEN TABS */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, styles.activeTab]}
            onPress={() => router.push("/pages/men/menDashboard" as any)}
          >
            <Text>MEN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => router.push("/pages/women/womenDashboard" as any)}
          >
            <Text>WOMEN</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: `${BASE_URL}/images/banner-men.png` }}
          style={styles.banner}
        />

=======
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b2314"]}
            tintColor="#3b2314"
          />
        }
      >
        <Navbar
          isDrawerOpen={drawerOpen}
          onMenuPress={() => setDrawerOpen(true)}
        />

        {/* MEN / WOMEN tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={styles.activeTabText}>MEN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => router.push("/pages/women/womenDashboard" as any)}
          >
            <Text style={styles.tabText}>WOMEN</Text>
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <Image
          source={{ uri: `${BASE_URL}/images/banner-men.png` }}
          style={styles.banner}
          resizeMode="cover"
        />

        {/* TUXEDO & SUITS */}
>>>>>>> a8dc11a751f382b6c0c06c6ac9663dc02fa4395c
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.title}>TUXEDO & SUITS</Text>
            <TouchableOpacity
              onPress={() => router.push("/pages/men/menTuxedo" as any)}
            >
              <Text style={styles.viewMore}>view more</Text>
            </TouchableOpacity>
          </View>
<<<<<<< HEAD

          <View style={styles.row}>{tux.slice(0, 6).map(renderProduct)}</View>
        </View>

=======
          {tux.length === 0 ? (
            <Text style={styles.empty}>No tuxedo items available.</Text>
          ) : (
            <View style={styles.row}>{tux.slice(0, 6).map(renderProduct)}</View>
          )}
        </View>

        {/* PROM & STYLES */}
>>>>>>> a8dc11a751f382b6c0c06c6ac9663dc02fa4395c
        <View style={[styles.section, { marginBottom: 30 }]}>
          <View style={styles.header}>
            <Text style={styles.title}>PROM & STYLES</Text>
            <TouchableOpacity
              onPress={() => router.push("/pages/men/menProm" as any)}
            >
              <Text style={styles.viewMore}>view more</Text>
            </TouchableOpacity>
          </View>
<<<<<<< HEAD

          <View style={styles.row}>{prom.slice(0, 6).map(renderProduct)}</View>
        </View>
      </ScrollView>
=======
          {prom.length === 0 ? (
            <Text style={styles.empty}>No prom items available.</Text>
          ) : (
            <View style={styles.row}>
              {prom.slice(0, 6).map(renderProduct)}
            </View>
          )}
        </View>
      </ScrollView>
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
>>>>>>> a8dc11a751f382b6c0c06c6ac9663dc02fa4395c
    </View>
  );
};

export default MenDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  banner: { width: "100%", height: 180 },
  section: { marginTop: 20, paddingHorizontal: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#2b2b2b" },
  viewMore: { color: "#3b2314", fontSize: 13 },
  row: { flexDirection: "row", flexWrap: "wrap" },
  product: {
    width: "45%",
    margin: "2.5%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: { width: "100%", height: 130 },
  name: { marginTop: 6, fontSize: 12, color: "#444", paddingHorizontal: 8 },
  price: {
    marginTop: 2,
    fontWeight: "bold",
    color: "#3b2314",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

<<<<<<< HEAD
=======
  // Tabs
>>>>>>> a8dc11a751f382b6c0c06c6ac9663dc02fa4395c
  tabs: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 12,
    backgroundColor: "#eee",
    borderRadius: 20,
    overflow: "hidden",
  },
  tab: { paddingVertical: 8, paddingHorizontal: 28 },
  activeTab: { backgroundColor: "#C29E72" },
  tabText: { fontSize: 13, color: "#555", fontWeight: "500" },
  activeTabText: { fontSize: 13, color: "#3b2314", fontWeight: "bold" },

  // States
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  loadingText: { marginTop: 12, color: "#888", fontSize: 14 },
  errorText: {
    color: "#e53e3e",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#3b2314",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryText: { color: "#fff", fontWeight: "500" },
  empty: { color: "#aaa", fontSize: 13, paddingVertical: 10 },
});
