import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import API, { BASE_URL } from "../../services/api";

type User = {
  name: string;
  number: string;
  email: string;
  address: string;
  profile_photo?: string;
};

export default function Profile() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [user, setUser] = useState<User>({
    name: "",
    number: "",
    email: "",
    address: "",
  });

  const [form, setForm] = useState(user);
  const [resetModal, setResetModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/profile");
        setUser(res.data.user);
        setForm(res.data.user);
      } catch (err) {
        console.log("Profile load error:", err);
      }
    };

    loadProfile();
  }, []);

  const avatar = user.profile_photo
    ? `${BASE_URL}/storage/${user.profile_photo}`
    : `${BASE_URL}/images/user-icon.png`;

  const updateProfile = async () => {
    try {
      await API.post("/profile/update", form);
      alert("Profile updated!");
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    router.replace("/pages/login" as any);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* NAVBAR */}
      <Navbar onMenuPress={() => setSidebarVisible(true)} />

      {/* SIDEBAR */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <ScrollView style={styles.container}>
        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </View>

        {/* FIELDS */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />

          <Text style={styles.label}>Number:</Text>
          <TextInput
            style={styles.input}
            value={form.number}
            onChangeText={(t) => setForm({ ...form, number: t })}
          />

          <Text style={styles.label}>Email Address:</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
          />

          <Text style={styles.label}>Home Address:</Text>
          <TextInput
            style={styles.input}
            value={form.address}
            onChangeText={(t) => setForm({ ...form, address: t })}
          />
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => setResetModal(true)}
          >
            <Text style={styles.btnText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.updateBtn} onPress={updateProfile}>
            <Text style={styles.btnText}>UPDATE PROFILE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.btnText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* RESET PASSWORD MODAL */}
      <Modal visible={resetModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Reset Password</Text>

            <TextInput placeholder="Current Password" style={styles.input} />
            <TextInput placeholder="New Password" style={styles.input} />
            <TextInput placeholder="Confirm Password" style={styles.input} />

            <TouchableOpacity
              style={styles.updateBtn}
              onPress={() => setResetModal(false)}
            >
              <Text style={styles.btnText}>RESET</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setResetModal(false)}>
              <Text style={{ textAlign: "center", marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    padding: 20,
  },

  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },

  infoContainer: {
    marginTop: 25,
  },

  label: {
    fontWeight: "bold",
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },

  actions: {
    marginTop: 30,
    gap: 10,
  },

  resetBtn: {
    backgroundColor: "#999",
    padding: 12,
    borderRadius: 10,
  },

  updateBtn: {
    backgroundColor: "#89d64a",
    padding: 12,
    borderRadius: 10,
  },

  logoutBtn: {
    backgroundColor: "#d9534f",
    padding: 12,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },

  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
