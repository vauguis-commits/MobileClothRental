import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
<<<<<<< HEAD

import Navbar from "../../../component/Navbar";
import Sidebar from "../../../component/Sidebar"; // ✅ ADDED
=======
import Drawer from "../../../component/Drawer";
import Navbar from "../../../component/Navbar";
>>>>>>> a8dc11a751f382b6c0c06c6ac9663dc02fa4395c
import API, { BASE_URL } from "../../../services/api";

type Product = {
  id: number;
  image: string;
  item_name: string;
  rental_fee: number;
};

type PriceFilter = "" | "low" | "mid" | "high";

const PRICE_FILTERS: { label: string; value: PriceFilter }[] = [
  { label: "All Prices", value: "" },
  { label: "₱0 – ₱350", value: "low" },
  { label: "₱351 – ₱450", value: "mid" },
  { label: "₱451+", value: "high" },
];

export default function MenProm() {
  // ── ALL hooks first ──────────────────────────────────────────
  const [prom, setProm] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

<<<<<<< HEAD
  const [sidebarVisible, setSidebarVisible] = useState(false); // ✅ ADDED

=======
  const filteredProducts = useMemo(() => {
    return prom.filter((product) => {
      const matchesSearch = product.item_name
        .toLowerCase()
        .includes(search.toLowerCase());
      const price = Number(product.rental_fee);
      const matchesPrice =
        priceFilter === "low"
          ? price <= 350
          : priceFilter === "mid"
            ? price >= 351 && price <= 450
            : priceFilter === "high"
              ? price >= 451
              : true;
      return matchesSearch && matchesPrice;
    });
  }, [prom, search, priceFilter]);

  useEffect(() => {
    loadData();
  }, []);

  // ── Functions ────────────────────────────────────────────────
>>>>>>> a8dc11a751f382b6c0c06c6ac9663dc02fa4395c
  const loadData = async () => {
    setError("");
    try {
      const res = await API.get("/men/prom");
      setProm(Array.isArray(res.data) ? res.data : res.data.prom || []);
    } catch {
      setError("Failed to load items. Pull down to try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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

<<<<<<< HEAD
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Navbar onMenuPress={() => setSidebarVisible(true)} />
        <ActivityIndicator size="large" color="#3b2314" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Navbar onMenuPress={() => setSidebarVisible(true)} />
        <Text style={styles.errorText}>⚠ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ✅ SIDEBAR ADDED */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      {/* NAVBAR */}
      <Navbar onMenuPress={() => setSidebarVisible(true)} />

      <Text style={styles.title}>PROM & STYLES</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍  Search prom styles..."
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filterRow}>
        {PRICE_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[
              styles.filterBtn,
              priceFilter === f.value && styles.filterBtnActive,
            ]}
            onPress={() => setPriceFilter(f.value)}
          >
            <Text
              style={[
                styles.filterText,
                priceFilter === f.value && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.resultCount}>
        {filteredProducts.length} item
        {filteredProducts.length !== 1 ? "s" : ""} found
      </Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b2314"]}
            tintColor="#3b2314"
          />
        }
      >
        {filteredProducts.length === 0 ? (
=======
  // ── Single return ────────────────────────────────────────────
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Navbar showBack />

        {loading ? (
>>>>>>> a8dc11a751f382b6c0c06c6ac9663dc02fa4395c
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#3b2314" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>⚠ {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadData}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
<<<<<<< HEAD
          <View style={styles.row}>
            {filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.product}
                onPress={() =>
                  router.push(
                    `/pages/product/productDetails?id=${product.id}` as any,
                  )
                }
              >
                <Image
                  source={{ uri: productImage(product.image) }}
                  style={styles.image}
=======
          <>
            <Text style={styles.pageTitle}>PROM & STYLES</Text>

            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="🔍  Search prom styles..."
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>

            <View style={styles.filterRow}>
              {PRICE_FILTERS.map((f) => (
                <TouchableOpacity
                  key={f.value}
                  style={[
                    styles.filterBtn,
                    priceFilter === f.value && styles.filterBtnActive,
                  ]}
                  onPress={() => setPriceFilter(f.value)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      priceFilter === f.value && styles.filterTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.resultCount}>
              {filteredProducts.length} item
              {filteredProducts.length !== 1 ? "s" : ""} found
            </Text>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#3b2314"]}
                  tintColor="#3b2314"
>>>>>>> a8dc11a751f382b6c0c06c6ac9663dc02fa4395c
                />
              }
            >
              {filteredProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.empty}>No items match your search.</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSearch("");
                      setPriceFilter("");
                    }}
                    style={styles.clearBtn}
                  >
                    <Text style={styles.clearText}>Clear filters</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.row}>
                  {filteredProducts.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.product}
                      onPress={() =>
                        router.push(
                          `/pages/product/productDetails?id=${product.id}` as any,
                        )
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
                      <Text style={styles.price}>
                        ₱{formatPrice(product.rental_fee)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          </>
        )}
<<<<<<< HEAD
      </ScrollView>
=======
      </SafeAreaView>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
>>>>>>> a8dc11a751f382b6c0c06c6ac9663dc02fa4395c
    </View>
  );
}
const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 10,
    color: "#2b2b2b",
  },
  searchRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingBottom: 8,
    gap: 6,
    flexWrap: "wrap",
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  filterBtnActive: { backgroundColor: "#3b2314", borderColor: "#3b2314" },
  filterText: { fontSize: 12, color: "#555" },
  filterTextActive: { color: "#fff", fontWeight: "500" },
  resultCount: {
    paddingHorizontal: 14,
    paddingBottom: 6,
    fontSize: 12,
    color: "#888",
  },
  scrollContent: { paddingBottom: 30 },
  row: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 6 },
  product: {
    width: "46%",
    margin: "2%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  image: { width: "100%", height: 160 },
  name: { paddingHorizontal: 8, paddingTop: 6, fontSize: 12, color: "#444" },
  price: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontWeight: "bold",
    color: "#3b2314",
    fontSize: 13,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    marginTop: 40,
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
  empty: { color: "#aaa", fontSize: 14, marginBottom: 12 },
  clearBtn: {
    borderWidth: 1,
    borderColor: "#3b2314",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearText: { color: "#3b2314", fontWeight: "500" },
});
