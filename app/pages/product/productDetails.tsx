import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "../../../component/Navbar";
import Sidebar from "../../../component/Sidebar"; // ✅ ADDED
import API, { BASE_URL } from "../../../services/api";

type Size = {
  size: string;
  chest: number;
  waist: number;
  hip: number;
  available: number;
};

type Product = {
  id: number;
  item_name: string;
  image: string;
  rental_fee: number;
  quantity: number;
  sizes: Size[] | string;
};

export default function ProductDetails() {
  const { id } = useLocalSearchParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sidebarVisible, setSidebarVisible] = useState(false); // ✅ ADDED

  useEffect(() => {
    const loadProduct = async () => {
      setError("");
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        setError("Failed to load product. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  const getSizes = (): Size[] => {
    if (!product?.sizes) return [];
    try {
      const parsed =
        typeof product.sizes === "string"
          ? JSON.parse(product.sizes)
          : product.sizes;

      return Array.isArray(parsed)
        ? parsed.filter(
            (s) =>
              s &&
              s.size !== undefined &&
              s.chest !== undefined &&
              s.waist !== undefined &&
              s.hip !== undefined,
          )
        : [];
    } catch {
      return [];
    }
  };

  const formatPrice = (price: number) =>
    Number(price || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const productImage = (image: string) =>
    image ? `${BASE_URL}/storage/${image}` : `${BASE_URL}/images/hfhmn.jpg`;

  const capitalize = (val: string) =>
    val ? val.charAt(0).toUpperCase() + val.slice(1) : "";

  const isOutOfStock = Number(product?.quantity) <= 0;
  const sizes = getSizes();

  // ── Loading ──
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Navbar onMenuPress={() => setSidebarVisible(true)} />
        <ActivityIndicator size="large" color="#3b2314" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </SafeAreaView>
    );
  }

  // ── Error ──
  if (error || !product) {
    return (
      <SafeAreaView style={styles.centered}>
        <Navbar onMenuPress={() => setSidebarVisible(true)} />
        <Text style={styles.errorText}>⚠ {error || "Product not found."}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Main ──
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ✅ SIDEBAR */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      {/* NAVBAR */}
      <Navbar onMenuPress={() => setSidebarVisible(true)} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        <Image
          source={{ uri: productImage(product.image) }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          {isOutOfStock && (
            <View style={styles.outOfStockBanner}>
              <Text style={styles.outOfStockTitle}>Out of Stock</Text>
              <Text style={styles.outOfStockMsg}>
                This item is currently unavailable for reservation.
              </Text>
            </View>
          )}

          <Text style={styles.productName}>{product.item_name}</Text>
          <Text style={styles.rentPrice}>
            Rent for ₱{formatPrice(product.rental_fee)}
          </Text>

          <View style={styles.divider} />

          {sizes.length > 0 && (
            <View style={styles.sizeSection}>
              <Text style={styles.sizeTitle}>AVAILABLE SIZES (inches)</Text>

              <View style={[styles.tableRow, styles.tableHeader]}>
                {["Size", "Chest", "Waist", "Hip", "Stock"].map((h) => (
                  <Text
                    key={h}
                    style={[styles.tableCell, styles.tableHeaderText]}
                  >
                    {h}
                  </Text>
                ))}
              </View>

              {sizes.map((size, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 && styles.tableRowAlt,
                  ]}
                >
                  <Text style={styles.tableCell}>{capitalize(size.size)}</Text>
                  <Text style={styles.tableCell}>{size.chest}</Text>
                  <Text style={styles.tableCell}>{size.waist}</Text>
                  <Text style={styles.tableCell}>{size.hip}</Text>
                  <Text
                    style={[
                      styles.tableCell,
                      Number(size.available) > 0
                        ? styles.availableText
                        : styles.unavailableText,
                    ]}
                  >
                    {Number(size.available) > 0
                      ? `${size.available} left`
                      : "None"}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.rentBtn, isOutOfStock && styles.rentBtnDisabled]}
            disabled={isOutOfStock}
            onPress={() =>
              router.push(`/pages/product/checkout?id=${product.id}` as any)
            }
          >
            <Text style={styles.rentBtnText}>
              {isOutOfStock ? "OUT OF STOCK" : "RENT NOW"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Layout
  scrollContent: { paddingBottom: 40 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  infoContainer: { padding: 20 },

  // Image
  image: { width: "100%", height: 300, backgroundColor: "#f0f0f0" },

  // Out of stock
  outOfStockBanner: {
    backgroundColor: "#f8d7da",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  outOfStockTitle: {
    color: "#721c24",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
  },
  outOfStockMsg: { color: "#721c24", fontSize: 13 },

  // Name & price
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2b2b2b",
    marginBottom: 6,
  },
  rentPrice: {
    fontSize: 18,
    color: "#3b2314",
    fontWeight: "600",
    marginBottom: 4,
  },

  // Divider
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },

  // Size table
  sizeSection: { marginBottom: 8 },
  sizeTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  tableRow: { flexDirection: "row", paddingVertical: 10, borderRadius: 4 },
  tableRowAlt: { backgroundColor: "#fafafa" },
  tableHeader: { backgroundColor: "#3b2314", borderRadius: 6, marginBottom: 2 },
  tableCell: { flex: 1, textAlign: "center", fontSize: 12, color: "#444" },
  tableHeaderText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  availableText: { color: "#2d6a4f", fontWeight: "600" },
  unavailableText: { color: "#dc3545", fontWeight: "bold" },

  // Rent button
  rentBtn: {
    backgroundColor: "#3b2314",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  rentBtnDisabled: { backgroundColor: "#ccc" },
  rentBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 1,
  },

  // States
  loadingText: { marginTop: 12, color: "#888", fontSize: 14 },
  errorText: {
    color: "#e53e3e",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: "#3b2314",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryText: { color: "#fff", fontWeight: "500" },
});
