import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import API, { BASE_URL } from "../../services/api";

type Setting = {
  store_name: string;
  logo: string;
  contact_number: string;
  email: string;
  address: string;
};

const About = () => {
  const [setting, setSetting] = useState<Setting>({
    store_name: "",
    logo: "",
    contact_number: "",
    email: "",
    address: "",
  });

  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await API.get("/settings");
        setSetting(res.data);
      } catch (error) {
        console.log("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  const logoSrc = setting.logo
    ? `${BASE_URL}/${setting.logo}`
    : `${BASE_URL}/images/hfhmn.jpg`;

  return (
    <View style={{ flex: 1 }}>
      {/* SIDEBAR */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <ScrollView style={styles.container}>
        {/* NAVBAR */}
        <Navbar onMenuPress={() => setSidebarVisible(true)} />

        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Image source={{ uri: logoSrc }} style={styles.logo} />
        </View>

        {/* TEXT */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Welcome to {setting.store_name || "Soleil Laluna Boutique"}, a
            premier clothing rental service specializing in tuxedos, suits,
            wedding gowns, and formal dresses. We provide elegant, high-quality
            attire for weddings, corporate events, and special occasions.
          </Text>

          <Text style={styles.text}>
            Our goal is to offer clients a convenient and affordable way to look
            their best without compromising on style or sophistication. Each
            garment is carefully maintained and tailored to ensure a perfect fit
            and a polished appearance.
          </Text>

          <Text style={styles.text}>
            At Soleil Laluna Boutique, we take pride in delivering exceptional
            service, attention to detail, and timeless fashion for every event.
          </Text>
        </View>

        {/* CONTACT */}
        <View style={styles.contact}>
          <Text style={styles.contactTitle}>CONTACT US</Text>

          <Text style={styles.contactItem}>
            📞 {setting.contact_number || "09195048788"}
          </Text>

          <Text style={styles.contactItem}>
            ✉️ {setting.email || "soliellaluna.boutique@gmail.com"}
          </Text>

          <Text style={styles.contactItem}>
            📍 {setting.address || "Brgy. Washington, Surigao City"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  textContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  text: {
    fontSize: 14,
    color: "#444",
    marginBottom: 15,
    textAlign: "justify",
  },

  contact: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center", // ✅ centers all children horizontally
  },

  contactTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", // ✅ centers text
  },

  contactItem: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center", // ✅ centers each line
  },
});
