import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import API, { BASE_URL } from "../../services/api";

type Tab = "rented" | "notif" | "settings";

const SIZES = ["small", "medium", "large", "xl"];

export default function Profile() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("rented");

  // profile data
  const [user, setUser] = useState<any>({});
  const [reservations, setReservations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // settings form
  const [form, setForm] = useState({
    name: "",
    number: "",
    email: "",
    address: "",
  });
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<any>(null);

  // edit reservation modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    size: "",
    delivery: "delivery",
    rent_time: "",
  });

  // reset password modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<any>({});

  const getToken = () => AsyncStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const res = await API.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const u = data.user || {};

      setUser(u);
      setReservations(data.reservations || []);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);

      setForm({
        name: u.name || "",
        number: u.number || "",
        email: u.email || "",
        address: u.address || "",
      });

      setAvatarUri(
        u.profile_photo ? `${BASE_URL}/storage/${u.profile_photo}` : null,
      );
    } catch (err: any) {
      if (err?.response?.status === 401) {
        await AsyncStorage.removeItem("token");
        router.replace("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const markNotificationsRead = async () => {
    if (unreadCount === 0) return;
    try {
      const token = await getToken();
      await API.post(
        "/profile/notifications/read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (_) {}
  };

  const openNotifTab = () => {
    setActiveTab("notif");
    markNotificationsRead();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ── Settings ────────────────────────────────────────────────────────────────

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const img = result.assets[0];
      setAvatarUri(img.uri);
      setAvatarFile(img);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("number", form.number || "");
      fd.append("email", form.email);
      fd.append("address", form.address || "");
      if (avatarFile) {
        fd.append("avatar", {
          uri: avatarFile.uri,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
      }
      const res = await fetch(`${BASE_URL}/api/profile/update`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error();
      await fetchProfile();
      alert("Profile updated!");
    } catch {
      alert("Update failed.");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/auth/login");
  };

  const resetPassword = async () => {
    try {
      setPasswordErrors({});
      const token = await getToken();
      await API.post("/profile/reset-password", passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowResetModal(false);
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      alert("Password reset successfully.");
    } catch (err: any) {
      setPasswordErrors(err?.response?.data?.errors || {});
    }
  };

  // ── Rented Items ─────────────────────────────────────────────────────────────

  const openEditModal = (r: any) => {
    setEditForm({
      id: String(r.id),
      size: (r.size || "").toLowerCase(),
      delivery: r.delivery || "delivery",
      rent_time: r.rent_time ? r.rent_time.slice(0, 16) : "",
    });
    setShowEditModal(true);
  };

  const updateReservation = async () => {
    try {
      const token = await getToken();
      await API.post(
        `/reservations/${editForm.id}/update`,
        {
          size: editForm.size,
          delivery: editForm.delivery,
          rent_time: editForm.rent_time,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowEditModal(false);
      await fetchProfile();
      alert("Reservation updated!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Update failed.");
    }
  };

  const productImage = (img?: string) =>
    img ? `${BASE_URL}/storage/${img}` : `${BASE_URL}/images/hfhmn.jpg`;

  const formatPrice = (p: any) =>
    Number(p || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (v: any) => {
    if (!v) return "-";
    const d = new Date(v);
    return isNaN(d.getTime()) ? String(v) : d.toLocaleString();
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      <Navbar onMenuPress={() => setSidebarVisible(true)} />

      {/* ── USER SUMMARY ── */}
      <View style={s.userSummary}>
        <Image
          source={
            avatarUri
              ? { uri: avatarUri }
              : require("../../assets/images/default-avatar.png")
          }
          style={s.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={s.userName}>{user.name || "—"}</Text>
          <Text style={s.userMeta}>{user.email || "—"}</Text>
          <Text style={s.userMeta}>{user.number || "—"}</Text>
        </View>
      </View>

      {/* ── TABS ── */}
      <View style={s.tabBar}>
        <TouchableOpacity
          style={[s.tabBtn, activeTab === "rented" && s.tabActive]}
          onPress={() => setActiveTab("rented")}
        >
          <Text style={[s.tabText, activeTab === "rented" && s.tabTextActive]}>
            Rented Items
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.tabBtn, activeTab === "notif" && s.tabActive]}
          onPress={openNotifTab}
        >
          <Text style={[s.tabText, activeTab === "notif" && s.tabTextActive]}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.tabBtn, activeTab === "settings" && s.tabActive]}
          onPress={() => setActiveTab("settings")}
        >
          <Text
            style={[s.tabText, activeTab === "settings" && s.tabTextActive]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── TAB CONTENT ── */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* RENTED ITEMS */}
        {activeTab === "rented" && (
          <View style={s.panel}>
            {reservations.length === 0 ? (
              <Text style={s.emptyText}>No rented items yet.</Text>
            ) : (
              reservations.map((r) => (
                <View key={r.id} style={s.rentCard}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={{ uri: productImage(r.product?.image) }}
                      style={s.rentImage}
                      resizeMode="cover"
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={s.rentName} numberOfLines={2}>
                        {r.product?.item_name || "Deleted Product"}
                      </Text>
                      <Text style={s.rentMeta}>
                        Size: <Text style={s.rentVal}>{r.size || "—"}</Text>
                      </Text>
                      <Text style={s.rentMeta}>
                        Method:{" "}
                        <Text style={s.rentVal}>
                          {r.delivery === "delivery"
                            ? "For Delivery"
                            : "For Pick Up"}
                        </Text>
                      </Text>
                      <Text style={s.rentMeta}>
                        Rent Time:{" "}
                        <Text style={s.rentVal}>{formatDate(r.rent_time)}</Text>
                      </Text>
                      <Text style={s.rentMeta}>
                        Contact:{" "}
                        <Text style={s.rentVal}>{user.number || "—"}</Text>
                      </Text>
                      <Text style={s.rentMeta}>
                        Status:{" "}
                        <Text style={[s.rentVal, { color: "#555" }]}>
                          {r.status || "—"}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View style={s.rentFooter}>
                    <View style={s.priceBox}>
                      <Text style={s.priceText}>₱{formatPrice(r.price)}</Text>
                    </View>
                    <TouchableOpacity
                      disabled={[
                        "returned",
                        "Returned",
                        "cancelled",
                        "Cancelled",
                      ].includes(r.status)}
                      onPress={() => openEditModal(r)}
                    >
                      <Text
                        style={[
                          s.updateLink,
                          [
                            "returned",
                            "Returned",
                            "cancelled",
                            "Cancelled",
                          ].includes(r.status) && { opacity: 0.35 },
                        ]}
                      >
                        update details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notif" && (
          <View style={s.panel}>
            {notifications.length === 0 ? (
              <Text style={s.emptyText}>No notifications yet.</Text>
            ) : (
              notifications.map((n) => (
                <View
                  key={n.id}
                  style={[s.notifCard, !n.is_read && s.notifUnread]}
                >
                  <Image
                    source={
                      n.image
                        ? { uri: `${BASE_URL}/storage/${n.image}` }
                        : require("../../assets/images/default-avatar.png")
                    }
                    style={s.notifImage}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Text style={s.notifTitle} numberOfLines={1}>
                        {n.title || "Notification"}
                      </Text>
                      {!n.is_read && <View style={s.notifDot} />}
                    </View>
                    <Text style={s.notifMsg}>{n.message || ""}</Text>
                    <Text style={s.notifDate}>{formatDate(n.created_at)}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <View style={s.panel}>
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Image
                source={
                  avatarUri
                    ? { uri: avatarUri }
                    : require("../../assets/images/default-avatar.png")
                }
                style={s.settingsAvatar}
              />
              <TouchableOpacity style={s.uploadBtn} onPress={pickAvatar}>
                <Text style={{ color: "#fff", fontSize: 13 }}>
                  Upload Photo
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={s.label}>Name</Text>
            <TextInput
              style={s.input}
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
            />

            <Text style={s.label}>Number</Text>
            <TextInput
              style={s.input}
              value={form.number}
              keyboardType="numeric"
              onChangeText={(v) =>
                setForm({ ...form, number: v.replace(/\D/g, "") })
              }
            />

            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              value={form.email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(v) => setForm({ ...form, email: v })}
            />

            <Text style={s.label}>Home Address</Text>
            <TextInput
              style={s.input}
              value={form.address}
              onChangeText={(v) => setForm({ ...form, address: v })}
            />

            <TouchableOpacity onPress={() => setShowResetModal(true)}>
              <Text style={s.resetLink}>Reset Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.updateProfileBtn}
              onPress={handleUpdateProfile}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                UPDATE PROFILE
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ── EDIT RESERVATION MODAL ── */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <TouchableOpacity
              style={s.closeBtn}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={s.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>Edit Details</Text>

            <Text style={s.modalLabel}>Select Size</Text>
            <View style={s.sizeRow}>
              {SIZES.map((sz) => (
                <TouchableOpacity
                  key={sz}
                  style={[s.sizeBtn, editForm.size === sz && s.sizeBtnActive]}
                  onPress={() => setEditForm({ ...editForm, size: sz })}
                >
                  <Text
                    style={[
                      s.sizeBtnText,
                      editForm.size === sz && s.sizeBtnTextActive,
                    ]}
                  >
                    {sz.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.modalLabel}>Method</Text>
            <View style={s.methodRow}>
              {[
                ["delivery", "For Delivery"],
                ["pickup", "For Pick Up"],
              ].map(([val, label]) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    s.methodBtn,
                    editForm.delivery === val && s.methodBtnActive,
                  ]}
                  onPress={() => setEditForm({ ...editForm, delivery: val })}
                >
                  <Text
                    style={[
                      s.methodBtnText,
                      editForm.delivery === val && s.methodBtnTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.modalLabel}>Rent Time</Text>
            <TextInput
              style={s.input}
              value={editForm.rent_time}
              onChangeText={(v) => setEditForm({ ...editForm, rent_time: v })}
              placeholder="2026-05-10T10:30"
            />

            <TouchableOpacity
              style={s.updateProfileBtn}
              onPress={updateReservation}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                UPDATE DETAILS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.logoutBtn, { marginTop: 8 }]}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── RESET PASSWORD MODAL ── */}
      <Modal visible={showResetModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <TouchableOpacity
              style={s.closeBtn}
              onPress={() => setShowResetModal(false)}
            >
              <Text style={s.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>Reset Password</Text>

            <TextInput
              style={s.input}
              placeholder="Current Password"
              secureTextEntry
              value={passwordForm.current_password}
              onChangeText={(v) =>
                setPasswordForm({ ...passwordForm, current_password: v })
              }
            />
            {passwordErrors.current_password && (
              <Text style={s.errText}>
                {passwordErrors.current_password[0]}
              </Text>
            )}

            <TextInput
              style={s.input}
              placeholder="New Password"
              secureTextEntry
              value={passwordForm.password}
              onChangeText={(v) =>
                setPasswordForm({ ...passwordForm, password: v })
              }
            />
            {passwordErrors.password && (
              <Text style={s.errText}>{passwordErrors.password[0]}</Text>
            )}

            <TextInput
              style={s.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={passwordForm.password_confirmation}
              onChangeText={(v) =>
                setPasswordForm({ ...passwordForm, password_confirmation: v })
              }
            />

            <TouchableOpacity
              style={s.updateProfileBtn}
              onPress={resetPassword}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                RESET PASSWORD
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.logoutBtn, { marginTop: 8 }]}
              onPress={() => setShowResetModal(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  // user summary
  userSummary: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#ccc" },
  userName: { fontSize: 15, fontWeight: "700", color: "#111" },
  userMeta: { fontSize: 12, color: "#666", marginTop: 2 },

  // tabs
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  tabActive: { borderBottomWidth: 3, borderBottomColor: "#7D664A" },
  tabText: { fontSize: 12, fontWeight: "600", color: "#888" },
  tabTextActive: { color: "#7D664A" },

  // notification badge
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#e53935",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  // panel
  panel: { padding: 14, gap: 12 },
  emptyText: { textAlign: "center", marginTop: 40, color: "#999" },

  // rented card
  rentCard: {
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    padding: 14,
  },
  rentImage: {
    width: 90,
    height: 110,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  rentName: { fontSize: 14, fontWeight: "600", color: "#222", marginBottom: 6 },
  rentMeta: { fontSize: 12, color: "#555", marginBottom: 2 },
  rentVal: { color: "#111", fontWeight: "500" },
  rentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  priceBox: {
    backgroundColor: "#9BC67C",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priceText: { fontSize: 16, fontWeight: "700" },
  updateLink: { fontSize: 13, textDecorationLine: "underline", color: "#333" },

  // notification card
  notifCard: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notifUnread: { backgroundColor: "#DDD" },
  notifImage: {
    width: 60,
    height: 75,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  notifTitle: { fontSize: 14, fontWeight: "700", color: "#111", flex: 1 },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e53935",
  },
  notifMsg: { fontSize: 12, color: "#444", marginTop: 4 },
  notifDate: { fontSize: 11, color: "#888", marginTop: 4 },

  // settings
  settingsAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ccc",
    marginBottom: 8,
  },
  uploadBtn: {
    backgroundColor: "#0091ff",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  label: { fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 4 },
  input: {
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  resetLink: {
    color: "#0055cc",
    textDecorationLine: "underline",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
  },
  updateProfileBtn: {
    backgroundColor: "#89d64a",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: "#d9534f",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },

  // modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  closeBtn: { position: "absolute", top: 14, right: 16, zIndex: 10 },
  closeBtnText: { fontSize: 20, fontWeight: "700" },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 6,
  },
  sizeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  sizeBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  sizeBtnActive: { backgroundColor: "#7D664A", borderColor: "#7D664A" },
  sizeBtnText: { color: "#444", fontSize: 13 },
  sizeBtnTextActive: { color: "#fff", fontWeight: "700" },
  methodRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  methodBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  methodBtnActive: { backgroundColor: "#7D664A", borderColor: "#7D664A" },
  methodBtnText: { color: "#444", fontSize: 13 },
  methodBtnTextActive: { color: "#fff", fontWeight: "700" },
  errText: { color: "#d9534f", fontSize: 12, marginTop: -8, marginBottom: 8 },
});
