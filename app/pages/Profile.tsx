import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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

  const [showReset, setShowReset] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [passwordErrors, setPasswordErrors] = useState<any>({});

  const [isInitialized, setIsInitialized] = useState(false);

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  const fetchProfile = async () => {
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

      const user = res?.data?.user;

      setName(user.name || "");
      setNumber(user.number || "");
      setEmail(user.email || "");
      setAddress(user.address || "");

      setAvatar(
        user.profile_photo ? `${BASE_URL}/storage/${user.profile_photo}` : null,
      );

      setIsInitialized(true);
    } catch (err: any) {
      console.log("PROFILE ERROR:", err?.response?.data || err.message);

      if (err?.response?.status === 401) {
        await AsyncStorage.removeItem("token");
        router.replace("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUploadPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      setAvatar(img.uri);
      setAvatarFile(img);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await getToken();

      const formData = new FormData();
      formData.append("name", name);
      formData.append("number", number || "");
      formData.append("email", email);
      formData.append("address", address || "");

      // ✅ FIXED: MUST be "avatar" (Laravel expects this)
      if (avatarFile) {
        formData.append("avatar", {
          uri: avatarFile.uri,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
      }

      const res = await fetch(`${BASE_URL}/api/profile/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      console.log("UPDATE RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Update failed");
      }

      await fetchProfile();
      alert("Profile updated!");
    } catch (err: any) {
      console.log("UPDATE ERROR:", err.message);
      alert("Update failed");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/auth/login");
  };

  const resetPassword = async () => {
    try {
      const token = await getToken();

      const res = await API.post("/profile/reset-password", passwordForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      if (data?.errors) {
        setPasswordErrors(data.errors);
        return;
      }

      setShowReset(false);
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

        <View style={styles.formContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Number</Text>
          <TextInput
            style={styles.input}
            value={number}
            onChangeText={setNumber}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Home Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />

          <TouchableOpacity onPress={() => setShowReset(true)}>
            <Text style={styles.resetPasswordText}>Reset Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.updateBtn}
          onPress={handleUpdateProfile}
        >
          <Text style={{ color: "#fff" }}>UPDATE PROFILE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={{ color: "#fff" }}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  uploadBtn: {
    backgroundColor: "#0091ff",
    padding: 8,
    borderRadius: 8,
    marginVertical: 10,
  },
  formContainer: { marginTop: 20 },
  label: { fontSize: 14, fontWeight: "600" },
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
  },
  logoutBtn: {
    backgroundColor: "red",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  resetPasswordText: {
    color: "#0d6efd",
    textDecorationLine: "underline",
    textAlign: "center",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
