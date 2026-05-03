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

export default function Profile() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<any>(null);

  // RESET PASSWORD
  const [showReset, setShowReset] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<any>({});

  // LOAD USER
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/user");
        const data = res.data;

        setName(data.name || "");
        setNumber(data.number || "");
        setEmail(data.email || "");
        setAddress(data.address || "");

        setAvatar(data.avatar ? `${BASE_URL}/storage/${data.avatar}` : null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // PICK IMAGE
  const handleUploadPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      setAvatar(img.uri);
      setAvatarFile(img);
    }
  };

  // UPDATE PROFILE
  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("number", number);
      formData.append("email", email);
      formData.append("address", address);

      if (avatarFile) {
        formData.append("avatar", {
          uri: avatarFile.uri,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
      }

      await API.post("/profile/update", formData, {
        headers: {
          Accept: "application/json",
        },
      });

      alert("Profile updated!");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    await API.post("/logout");
    await AsyncStorage.clear();
    router.replace("/auth/login");
  };

  // RESET PASSWORD
  const resetPassword = async () => {
    try {
      setPasswordErrors({});

      const res = await API.post("/api/profile/reset-password", passwordForm);

      if (res.data?.errors) {
        setPasswordErrors(res.data.errors);
        return;
      }

      setShowReset(false);
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });

      alert("Password reset successful");
    } catch (err: any) {
      setPasswordErrors(err?.response?.data?.errors || {});
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
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

      <ScrollView style={{ padding: 20 }}>
        <Text style={styles.title}>PROFILE</Text>

        {/* AVATAR */}
        <View style={{ alignItems: "center" }}>
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require("../../assets/images/default-avatar.png")
            }
            style={styles.avatar}
          />

          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={handleUploadPhoto}
          >
            <Text style={{ color: "#fff" }}>Upload Photo</Text>
          </TouchableOpacity>
        </View>

        {/* FORM */}
        <View style={styles.formContainer}>
          {/* NAME */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          {/* NUMBER */}
          <Text style={styles.label}>Number</Text>
          <TextInput
            style={styles.input}
            value={number}
            onChangeText={setNumber}
            placeholder="Enter your number"
          />

          {/* EMAIL */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
          />

          {/* ADDRESS */}
          <Text style={styles.label}>Home Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
          />

          {/* RESET PASSWORD */}
          <TouchableOpacity
            onPress={() => setShowReset(true)}
            style={styles.resetPasswordContainer}
          >
            <Text style={styles.resetPasswordText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
        {/* UPDATE */}
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={handleUpdateProfile}
        >
          <Text style={{ color: "#fff" }}>UPDATE PROFILE</Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={{ color: "#fff" }}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* RESET MODAL */}
      <Modal visible={showReset} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Reset Password</Text>

            <TextInput
              placeholder="Current Password"
              secureTextEntry
              style={styles.input}
              value={passwordForm.current_password}
              onChangeText={(t) =>
                setPasswordForm({
                  ...passwordForm,
                  current_password: t,
                })
              }
            />
            <Text style={styles.error}>{passwordErrors.current_password}</Text>

            <TextInput
              placeholder="New Password"
              secureTextEntry
              style={styles.input}
              value={passwordForm.password}
              onChangeText={(t) =>
                setPasswordForm({ ...passwordForm, password: t })
              }
            />
            <Text style={styles.error}>{passwordErrors.password}</Text>

            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              style={styles.input}
              value={passwordForm.password_confirmation}
              onChangeText={(t) =>
                setPasswordForm({
                  ...passwordForm,
                  password_confirmation: t,
                })
              }
            />
            <Text style={styles.error}>
              {passwordErrors.password_confirmation}
            </Text>

            <TouchableOpacity style={styles.updateBtn} onPress={resetPassword}>
              <Text style={{ color: "#fff" }}>RESET</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowReset(false)}>
              <Text style={{ textAlign: "center", marginTop: 10 }}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#3b2314",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  uploadBtn: {
    backgroundColor: "#0091ff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },

  formContainer: {
    marginTop: 20,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
    color: "#3b2314",
  },
  input: {
    backgroundColor: "#eee",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },

  updateBtn: {
    backgroundColor: "#89d64a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  logoutBtn: {
    backgroundColor: "red",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  resetLink: {
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },

  resetLinkText: {
    color: "#0d6efd",
    fontSize: 13,
    textDecorationLine: "underline",
    fontWeight: "500",
  },

  resetPasswordContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  resetPasswordText: {
    color: "#0d6efd",
    fontSize: 13,
    textDecorationLine: "underline",
    fontWeight: "500",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
