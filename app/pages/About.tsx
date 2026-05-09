import { Ionicons } from "@expo/vector-icons";
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

const BRAND = "#C29E72";
const DARK = "#4c3829";

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
    API.get("/settings")
      .then((res) => setSetting(res.data))
      .catch(() => {});
  }, []);

  const logoSrc = setting.logo
    ? `${BASE_URL}/${setting.logo}`
    : `${BASE_URL}/images/hfhmn.jpg`;

  const storeName = setting.store_name || "Soleil Laluna Boutique";

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Navbar onMenuPress={() => setSidebarVisible(true)} />

        {/* ── Hero ── */}
        <View style={s.hero}>
          <View style={s.logoRing}>
            <Image source={{ uri: logoSrc }} style={s.logo} />
          </View>
          <Text style={s.heroName}>{storeName.toUpperCase()}</Text>
          <View style={s.heroDivider} />
          <Text style={s.heroTagline}>Dress to impress, every occasion</Text>
        </View>

        {/* ── About text ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Ionicons name="storefront-outline" size={20} color={BRAND} />
            <Text style={s.sectionTitle}>Who We Are</Text>
          </View>
          <Text style={s.body}>
            Welcome to {storeName}, a premier clothing rental service
            specializing in tuxedos, suits, wedding gowns, and formal dresses.
            We provide elegant, high-quality attire for weddings, corporate
            events, and special occasions.
          </Text>
          <Text style={s.body}>
            Our goal is to offer clients a convenient and affordable way to look
            their best without compromising on style or sophistication. Each
            garment is carefully maintained and tailored to ensure a perfect fit
            and a polished appearance.
          </Text>
          <Text style={s.body}>
            At {storeName}, we take pride in delivering exceptional service,
            attention to detail, and timeless fashion for every event.
          </Text>
        </View>

        {/* ── Contact ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Ionicons name="call-outline" size={20} color={BRAND} />
            <Text style={s.sectionTitle}>Contact Us</Text>
          </View>

          <View style={s.contactCard}>
            {[
              {
                icon: "call-outline" as const,
                value: setting.contact_number || "09195048788",
              },
              {
                icon: "mail-outline" as const,
                value: setting.email || "soliellaluna.boutique@gmail.com",
              },
              {
                icon: "location-outline" as const,
                value: setting.address || "Brgy. Washington, Surigao City",
              },
            ].map((row, i) => (
              <View key={i} style={[s.contactRow, i > 0 && s.contactRowBorder]}>
                <View style={s.contactIcon}>
                  <Ionicons name={row.icon} size={20} color={BRAND} />
                </View>
                <Text style={s.contactText}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default About;

const s = StyleSheet.create({
  hero: {
    alignItems: "center",
    backgroundColor: "#4c3829",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  logoRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: BRAND,
    padding: 3,
    marginBottom: 14,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
  },
  heroName: {
    color: "#F5EDE0",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 3,
    textAlign: "center",
  },
  heroDivider: {
    width: 40,
    height: 2,
    backgroundColor: BRAND,
    marginVertical: 10,
    borderRadius: 2,
  },
  heroTagline: {
    color: "#C29E72",
    fontSize: 12,
    fontStyle: "italic",
    letterSpacing: 1,
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E1209",
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    textAlign: "justify",
    marginBottom: 12,
  },

  contactCard: {
    backgroundColor: "#FAF6F1",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EDE0D0",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  contactRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#EDE0D0",
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(194,158,114,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  contactText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
