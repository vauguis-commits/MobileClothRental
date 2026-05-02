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
import API, { BASE_URL } from "../../../services/api";

type Product = {
  id: number;
  image: string;
  item_name: string;
  rental_fee: number;
};

const WomenDashboard = () => {
  const [wedding, setWedding] = useState<Product[]>([]);
  const [prom, setProm] = useState<Product[]>([]);

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
    <ScrollView style={styles.container}>
      {/* NAVBAR */}
      <Navbar onMenuPress={() => console.log("Open sidebar")} />

      {/* MEN / WOMEN TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push("/pages/men/menDashboard" as any)}
        >
          <Text>MEN</Text>
        </TouchableOpacity>

        {/* ✅ FIXED: removed onPress */}
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text>WOMEN</Text>
        </TouchableOpacity>
      </View>

      {/* BANNER */}
      <Image
        source={{ uri: `${BASE_URL}/images/banner-women.png` }}
        style={styles.banner}
      />

      {/* WEDDING GOWNS */}
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.title}>WEDDING GOWNS</Text>
          <TouchableOpacity
            onPress={() => router.push("/pages/women/womenWedding" as any)}
          >
            <Text style={styles.viewMore}>view more</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>{wedding.slice(0, 6).map(renderProduct)}</View>
      </View>

      {/* PROM & STYLES */}
      <View style={[styles.section, { marginBottom: 30 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>PROM & STYLES</Text>
          <TouchableOpacity
            onPress={() => router.push("/pages/women/womenProm" as any)}
          >
            <Text style={styles.viewMore}>view more</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>{prom.slice(0, 6).map(renderProduct)}</View>
      </View>
    </ScrollView>
  );
};

export default WomenDashboard;

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

  /* TABS */
  tabs: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "#eee",
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
});
