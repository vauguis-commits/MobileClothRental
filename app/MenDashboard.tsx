import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Product = {
  id: number;
  image: string;
  item_name: string;
  rental_fee: number;
};

const MenDashboard = () => {
  const navigation = useNavigation<any>();

  const [tux, setTux] = useState<Product[]>([]);
  const [prom, setProm] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://192.168.137.1:8000/api/men", {
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        const data = await res.json();

        setTux(data.tux || []);
        setProm(data.prom || []);
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
      ? `http://192.168.137.1:8000/storage/${image}`
      : "http://192.168.137.1:8000/images/hfhmn.jpg";
  };

  const renderProduct = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.product}
      onPress={() => navigation.navigate("ProductDetails", { id: product.id })}
    >
      <Image
        source={{ uri: productImage(product.image) }}
        style={styles.image}
      />
      <Text style={styles.price}>₱{formatPrice(product.rental_fee)}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <Image
        source={{ uri: "http://192.168.137.1:8000/images/banner-men.png" }}
        style={styles.banner}
      />

      {/* TUXEDO */}
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.title}>TUXEDO & SUITS</Text>
          <TouchableOpacity onPress={() => navigation.navigate("MenTuxedo")}>
            <Text style={styles.viewMore}>view more</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>{tux.slice(0, 5).map(renderProduct)}</View>
      </View>

      {/* PROM */}
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.title}>PROM & STYLES</Text>
          <TouchableOpacity onPress={() => navigation.navigate("MenProm")}>
            <Text style={styles.viewMore}>view more</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>{prom.slice(0, 5).map(renderProduct)}</View>
      </View>
    </ScrollView>
  );
};

export default MenDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  banner: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewMore: {
    color: "blue",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  product: {
    width: "45%",
    margin: 5,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  price: {
    marginTop: 5,
    fontWeight: "bold",
  },
});
