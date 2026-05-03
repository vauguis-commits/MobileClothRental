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
import Navbar from "../../../component/Navbar";
import API, { BASE_URL } from "../../../services/api";

import Sidebar from "../../../component/Sidebar";

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

export default function WomenWedding() {
  const [wedding, setWedding] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("");

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const loadData = async () => {
    setError("");
    try {
      const res = await API.get("/women/wedding");
      setWedding(Array.isArray(res.data) ? res.data : res.data.wedding || []);
    } catch {
      setError("Failed to load items. Pull down to try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // FILTER LOGIC
  const filteredProducts = useMemo(() => {
    return wedding.filter((product) => {
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
  }, [wedding, search, priceFilter]);

  const formatPrice = (price: number) =>
    Number(price || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const productImage = (image: string) =>
    image ? `${BASE_URL}/storage/${image}` : `${BASE_URL}/images/hfhmn.jpg`;

  // LOADING
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#3b2314" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // ERROR
  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>⚠ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // MAIN
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

      {/* SEARCH */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍  Search wedding gowns..."
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {/* FILTER */}
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

      {/* COUNT */}
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
          <View style={styles.centered}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 10,
    fontSize: 18,
    alignSelf: "center",
    fontWeight: "bold",
  },

  searchRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    flexWrap: "wrap",
    gap: 6,
  },

  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  filterBtnActive: {
    backgroundColor: "#3b2314",
    borderColor: "#3b2314",
  },

  filterText: { fontSize: 12, color: "#555" },
  filterTextActive: { color: "#fff" },

  resultCount: {
    paddingHorizontal: 14,
    fontSize: 12,
    color: "#888",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 6,
  },

  product: {
    width: "46%",
    margin: "2%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
  },

  image: { width: "100%", height: 160 },

  name: {
    paddingHorizontal: 8,
    paddingTop: 6,
    fontSize: 12,
    color: "#444",
  },

  price: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontWeight: "bold",
    color: "#3b2314",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: { marginTop: 12 },
  errorText: { color: "red", marginBottom: 10 },

  retryButton: {
    backgroundColor: "#3b2314",
    padding: 10,
    borderRadius: 5,
  },

  retryText: { color: "#fff" },

  empty: { color: "#aaa", marginBottom: 10 },

  clearBtn: {
    borderWidth: 1,
    borderColor: "#3b2314",
    padding: 8,
    borderRadius: 5,
  },

  clearText: { color: "#3b2314" },

  scrollContent: { paddingBottom: 30 },
});
