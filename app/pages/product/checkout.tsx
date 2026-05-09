import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Navbar from "../../../component/Navbar";
import Sidebar from "../../../component/Sidebar";
import API, { BASE_URL } from "../../../services/api";

export default function Checkout() {
  const { id } = useLocalSearchParams();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState<any>(null);
  const [availableSizes, setAvailableSizes] = useState<any[]>([]);
  const [gcashNumber, setGcashNumber] = useState("09876543210");

  const [selectedSize, setSelectedSize] = useState("");
  const [delivery, setDelivery] = useState("delivery");
  const [rentTime, setRentTime] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [gcashReference, setGcashReference] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    fetchCheckoutData();
  }, [id]);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      const res = await API.get(`/checkout/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProduct(res.data.product);
      setAvailableSizes(res.data.availableSizes || []);

      const firstAvail = (res.data.availableSizes || []).find(
        (s: any) => s.available > 0,
      );

      if (firstAvail) setSelectedSize(firstAvail.size);

      const settingsRes = await API.get("/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (settingsRes.data?.gcash_number) {
        setGcashNumber(settingsRes.data.gcash_number);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to load checkout details.");
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = delivery === "delivery" ? 50 : 0;
  const totalPrice = (product?.rental_fee || 0) + deliveryFee;

  const handleConfirm = async () => {
    if (!selectedSize || !rentTime || !gcashReference || !contact) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      await API.post(
        "/checkout/store",
        {
          product_id: product?.id,
          price: product?.rental_fee,
          size: selectedSize,
          delivery,
          rent_time: rentTime.toISOString(),
          gcash_reference: gcashReference,
          contact,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      Alert.alert("Success", "Order placed successfully.");

      // FIXED ROUTE (safe for expo-router)
      router.replace("/pages/RentedItems" as any);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Checkout failed");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      <Navbar onMenuPress={() => setSidebarVisible(true)} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* IMAGE */}
        <Image
          source={{
            uri: product?.image
              ? `${BASE_URL}/storage/${product.image}`
              : "https://via.placeholder.com/300",
          }}
          style={styles.productImage}
        />

        <View style={styles.formSection}>
          {/* SIZE */}
          <Text style={styles.label}>Select Size</Text>

          <View style={styles.sizeContainer}>
            {availableSizes.map((item: any) => (
              <TouchableOpacity
                key={item.size}
                style={[
                  styles.sizeBtn,
                  selectedSize === item.size && styles.sizeBtnActive,
                  item.available <= 0 && styles.sizeBtnDisabled,
                ]}
                onPress={() => setSelectedSize(item.size)}
                disabled={item.available <= 0}
              >
                <Text>{item.size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DELIVERY */}
          <Text style={styles.label}>Delivery</Text>

          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => setDelivery("delivery")}
          >
            <Ionicons
              name={
                delivery === "delivery" ? "radio-button-on" : "radio-button-off"
              }
              size={20}
              color="#89d64a"
            />
            <Text style={styles.radioText}>For Delivery (₱50)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => setDelivery("pickup")}
          >
            <Ionicons
              name={
                delivery === "pickup" ? "radio-button-on" : "radio-button-off"
              }
              size={20}
              color="#89d64a"
            />
            <Text style={styles.radioText}>For Pick Up</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* RENT TIME */}
          <Text style={styles.label}>Rent Time</Text>

          <TouchableOpacity
            style={styles.dateTimeInput}
            onPress={() => setDatePickerVisibility(true)}
          >
            <Text>
              {rentTime ? rentTime.toLocaleString() : "Select Date and Time"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="gray" />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            display="spinner"
            onConfirm={(date: Date) => {
              console.log("DATE PICKED:", date);
              setRentTime(date);
              setDatePickerVisibility(false);
            }}
            onCancel={() => {
              console.log("PICKER CANCELLED");
              setDatePickerVisibility(false);
            }}
          />

          {/* CONTACT */}
          <Text style={styles.label}>Contact Person</Text>

          <TextInput
            style={styles.referenceInput}
            value={contact}
            onChangeText={setContact}
            placeholder="Phone Number"
          />

          {/* PAYMENT */}
          <View style={styles.paymentBox}>
            <Text style={styles.paymentTitle}>Payment Details</Text>

            <View style={styles.tableRow}>
              <Text>Item</Text>
              <Text>₱{product?.rental_fee}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text>Delivery Fee</Text>
              <Text>₱{deliveryFee}</Text>
            </View>

            <View style={[styles.tableRow, styles.totalRow]}>
              <Text style={styles.boldText}>Total</Text>
              <Text style={styles.boldText}>₱{totalPrice}</Text>
            </View>
          </View>

          {/* GCASH */}
          <Text style={styles.gcashNote}>
            Pay via GCash: <Text style={styles.blueText}>{gcashNumber}</Text>
          </Text>

          <Text style={styles.warningText}>
            Note: Payment is non-refundable.
          </Text>

          <TextInput
            style={styles.referenceInput}
            placeholder="GCash Reference Number"
            value={gcashReference}
            onChangeText={setGcashReference}
          />

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmBtnText}>CONFIRM & CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* styles unchanged */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 40 },
  productImage: { width: "100%", height: 350, resizeMode: "cover" },
  formSection: { padding: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, marginTop: 10 },
  sizeContainer: { flexDirection: "row", marginBottom: 15 },
  sizeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  sizeBtnActive: { backgroundColor: "#808080" },
  sizeBtnDisabled: { opacity: 0.3 },
  whiteText: { color: "#fff" },
  blackText: { color: "#000" },
  radioItem: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  radioText: { marginLeft: 10, fontSize: 14 },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 15 },
  dateTimeInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    color: "#555",
  },
  paymentBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
  },
  paymentTitle: { padding: 10, fontWeight: "bold", backgroundColor: "#f9f9f9" },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalRow: { backgroundColor: "#f0f0f0" },
  boldText: { fontWeight: "bold" },
  gcashNote: { fontSize: 12, marginTop: 15, color: "#444" },
  blueText: { color: "#0091ff", fontWeight: "600" },
  warningText: {
    fontSize: 11,
    color: "red",
    marginTop: 10,
    fontStyle: "italic",
  },
  referenceInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginTop: 15,
    backgroundColor: "#f9f9f9",
  },
  confirmBtn: {
    backgroundColor: "#228b22",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 25,
  },
  confirmBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
