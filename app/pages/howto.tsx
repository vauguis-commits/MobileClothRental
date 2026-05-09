import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";

const HowTo = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* SIDEBAR */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      {/* SCROLLABLE AREA */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* NAVBAR */}
        <Navbar onMenuPress={() => setSidebarVisible(true)} />

        {/* TITLE */}
        <Text style={styles.title}>HOW TO RENT?</Text>

        {/* STEPS */}
        <View style={styles.steps}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.icon}>🔍</Text>
            <Text style={styles.stepTitle}>Find a Style</Text>
            <Text style={styles.stepText}>Browse the clothing you like.</Text>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.stepTitle}>Set Date</Text>
            <Text style={styles.stepText}>
              Set when and how many days you rent the item.
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.icon}>📏</Text>
            <Text style={styles.stepTitle}>Get Measurements</Text>
            <Text style={styles.stepText}>
              Answer a few questions online or visit the store.
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.icon}>💳</Text>
            <Text style={styles.stepTitle}>Place Order</Text>
            <Text style={styles.stepText}>
              Enter the reference no. from GCash after payment.
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>5</Text>
            <Text style={styles.icon}>📦</Text>
            <Text style={styles.stepTitle}>Wait for Approval</Text>
            <Text style={styles.stepText}>
              Once the order is confirmed, the item can now be picked up or
              delivered.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HowTo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    paddingBottom: 40,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  steps: {
    paddingHorizontal: 20,
  },

  step: {
    marginBottom: 25,
    alignItems: "center",
  },

  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 5,
  },

  icon: {
    fontSize: 28,
    marginBottom: 5,
    textAlign: "center",
  },

  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },

  stepText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
