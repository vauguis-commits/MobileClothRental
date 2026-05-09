import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import API, { BASE_URL } from "../../services/api";

interface RentedItem {
  id: number | string;
  name: string;
  size: string;
  delivery: string;
  delivery_date: string;
  phone: string;
  price: string;
  image: string;
}

export default function RentedItems() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rentedItems, setRentedItems] = useState<RentedItem[]>([]);

  // ✅ MODAL
  const [showEditModal, setShowEditModal] = useState(false);

  const [editForm, setEditForm] = useState({
    id: "",
    size: "",
    delivery: "delivery",
    rent_time: "",
  });

  const availableSizes = ["small", "medium", "large", "xl"];

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  const fetchRentedItems = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const res = await API.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("PROFILE RESPONSE:", res.data);

      const reservations = res?.data?.reservations || [];

      const formatted = reservations.map((reservation: any) => ({
        id: reservation.id,

        name: reservation.product?.item_name || "Deleted Product",

        size: reservation.size || "-",

        delivery:
          reservation.delivery === "delivery"
            ? "For Delivery"
            : reservation.delivery === "pickup"
              ? "For Pick Up"
              : "-",

        delivery_value: reservation.delivery || "delivery",

        raw_rent_time: reservation.rent_time || "",

        delivery_date: reservation.rent_time
          ? new Date(reservation.rent_time).toLocaleString()
          : "-",

        phone:
          reservation.contact_number ||
          reservation.phone ||
          reservation.user?.number ||
          reservation.user?.contact_number ||
          "09876543210",

        price: reservation.price || "0",

        image: reservation.product?.image
          ? `${BASE_URL}/storage/${reservation.product.image}`
          : `${BASE_URL}/images/hfhmn.jpg`,
      }));

      console.log("FORMATTED RENTED ITEMS:", formatted);

      setRentedItems(formatted);
    } catch (err: any) {
      console.log(
        "FETCH RENTED ITEMS ERROR:",
        err.response?.data || err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentedItems();
  }, []);

  // ✅ OPEN MODAL
  const openEditModal = (item: any) => {
    setEditForm({
      id: item.id.toString(),
      size: item.size.toLowerCase(),
      delivery: item.delivery === "For Pick Up" ? "pickup" : "delivery",
      rent_time: item.raw_rent_time ? item.raw_rent_time.slice(0, 16) : "",
    });

    setShowEditModal(true);
  };

  // ✅ CLOSE MODAL
  const closeEditModal = () => {
    setShowEditModal(false);
  };

  // ✅ UPDATE RESERVATION
  const updateReservation = async () => {
    try {
      const token = await getToken();

      await API.put(
        `/reservations/${editForm.id}`,
        {
          size: editForm.size,
          delivery: editForm.delivery,
          rent_time: editForm.rent_time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      closeEditModal();

      fetchRentedItems();

      alert("Reservation updated successfully!");
    } catch (error: any) {
      console.log("UPDATE ERROR:", error.response?.data || error.message);

      alert("Failed to update reservation.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Image
          source={{
            uri: item.image,
          }}
          style={styles.itemImage}
          resizeMode="cover"
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.itemName}>{item.name}</Text>

          {/* SIZE */}
          <View style={styles.row}>
            <Text style={styles.label}>Size</Text>

            <View style={styles.sizeBadge}>
              <Text style={styles.sizeText}>{item.size}</Text>
            </View>
          </View>

          {/* METHOD */}
          <View style={styles.row}>
            <Text style={styles.label}>Method:</Text>

            <View style={styles.infoBadge}>
              <Text style={styles.infoText}>{item.delivery}</Text>
            </View>
          </View>

          {/* RENT TIME */}
          <View style={styles.row}>
            <Text style={styles.label}>Rent Time:</Text>

            <View style={styles.infoBadge}>
              <Text style={styles.infoText}>{item.delivery_date}</Text>
            </View>
          </View>

          {/* CONTACT */}
          <View style={styles.row}>
            <Text style={styles.label}>Contact:</Text>

            <View style={styles.infoBadge}>
              <Text style={styles.infoText}>09123456789</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>₱{item.price}</Text>
        </View>

        {/* ✅ WORKING BUTTON */}
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Text style={styles.updateLink}>update details</Text>
        </TouchableOpacity>
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

      <Text style={styles.headerTitle}>RENTED ITEMS</Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={rentedItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No rented items found.</Text>
          }
        />
      )}

      {/* ✅ EDIT MODAL */}
      <Modal visible={showEditModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={closeEditModal}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Edit Details</Text>

            {/* SIZE */}
            <Text style={styles.modalLabel}>Select Size</Text>

            <View style={styles.sizeOptions}>
              {availableSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOptionBtn,
                    editForm.size === size && styles.activeSizeBtn,
                  ]}
                  onPress={() =>
                    setEditForm({
                      ...editForm,
                      size,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.sizeOptionText,
                      editForm.size === size && styles.activeSizeText,
                    ]}
                  >
                    {size.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* DELIVERY METHOD */}
            <Text style={styles.modalLabel}>Method</Text>

            <View style={styles.methodRow}>
              <TouchableOpacity
                style={[
                  styles.methodBtn,
                  editForm.delivery === "delivery" && styles.activeMethodBtn,
                ]}
                onPress={() =>
                  setEditForm({
                    ...editForm,
                    delivery: "delivery",
                  })
                }
              >
                <Text
                  style={[
                    styles.methodText,
                    editForm.delivery === "delivery" && styles.activeMethodText,
                  ]}
                >
                  For Delivery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodBtn,
                  editForm.delivery === "pickup" && styles.activeMethodBtn,
                ]}
                onPress={() =>
                  setEditForm({
                    ...editForm,
                    delivery: "pickup",
                  })
                }
              >
                <Text
                  style={[
                    styles.methodText,
                    editForm.delivery === "pickup" && styles.activeMethodText,
                  ]}
                >
                  For Pick Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* RENT TIME */}
            <Text style={styles.modalLabel}>Rent Time</Text>

            <TextInput
              style={styles.input}
              value={editForm.rent_time}
              onChangeText={(text) =>
                setEditForm({
                  ...editForm,
                  rent_time: text,
                })
              }
              placeholder="2026-05-10T10:30"
            />

            {/* BUTTONS */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={updateReservation}
              >
                <Text style={styles.updateBtnText}>UPDATE DETAILS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={closeEditModal}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontFamily: "System",
  },

  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },

  cardContent: {
    flexDirection: "row",
  },

  itemImage: {
    width: 100,
    height: 120,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },

  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },

  itemName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    flexWrap: "wrap",
  },

  label: {
    fontSize: 12,
    color: "#333",
    marginRight: 5,
    fontWeight: "600",
  },

  sizeBadge: {
    backgroundColor: "#7D664A",
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 15,
  },

  sizeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  infoBadge: {
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 4,
  },

  infoText: {
    fontSize: 11,
    color: "#000",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 5,
  },

  priceContainer: {
    backgroundColor: "#9BC67C",
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    minWidth: 100,
  },

  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  updateLink: {
    fontSize: 14,
    color: "#000",
    textDecorationLine: "underline",
    fontWeight: "400",
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

  // ✅ MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },

  closeBtn: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 10,
  },

  closeText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },

  sizeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  sizeOptionBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },

  activeSizeBtn: {
    backgroundColor: "#7D664A",
    borderColor: "#7D664A",
  },

  sizeOptionText: {
    color: "#333",
  },

  activeSizeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  methodRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  methodBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  activeMethodBtn: {
    backgroundColor: "#7D664A",
    borderColor: "#7D664A",
  },

  methodText: {
    color: "#333",
    fontSize: 12,
  },

  activeMethodText: {
    color: "#fff",
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },

  modalActions: {
    gap: 10,
  },

  updateBtn: {
    backgroundColor: "#7D664A",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  updateBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  cancelBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelBtnText: {
    color: "#333",
    fontWeight: "600",
  },
});
