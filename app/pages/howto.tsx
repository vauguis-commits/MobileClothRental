import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";

const BRAND = "#C29E72";
const DARK = "#4c3829";

type Step = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
};

const STEPS: Step[] = [
  {
    icon: "search-outline",
    title: "Find a Style",
    desc: "Browse our collection of tuxedos, suits, gowns, and formal dresses.",
  },
  {
    icon: "calendar-outline",
    title: "Set Your Date",
    desc: "Choose your rental period and the date you need the outfit.",
  },
  {
    icon: "resize-outline",
    title: "Pick Your Size",
    desc: "Select your size or visit the store for measurements.",
  },
  {
    icon: "card-outline",
    title: "Pay via GCash",
    desc: "Complete your payment and enter your GCash reference number at checkout.",
  },
  {
    icon: "checkmark-circle-outline",
    title: "Wait for Approval",
    desc: "We'll confirm your order and arrange pickup or delivery.",
  },
];

const HowTo = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Navbar onMenuPress={() => setSidebarVisible(true)} />

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerIcon}>
            <Ionicons name="receipt-outline" size={28} color={BRAND} />
          </View>
          <Text style={s.headerTitle}>HOW TO RENT</Text>
          <Text style={s.headerSub}>
            Follow these simple steps to get started
          </Text>
        </View>

        {/* ── Timeline ── */}
        <View style={s.timeline}>
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1;
            return (
              <View key={i} style={s.stepRow}>
                {/* Left: number + connector line */}
                <View style={s.stepLeft}>
                  <View style={s.stepBadge}>
                    <Text style={s.stepNumber}>{i + 1}</Text>
                  </View>
                  {!isLast && <View style={s.connector} />}
                </View>

                {/* Right: icon card + content */}
                <View style={[s.stepCard, isLast && { marginBottom: 0 }]}>
                  <View style={s.stepIconBox}>
                    <Ionicons name={step.icon} size={24} color={BRAND} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.stepTitle}>{step.title}</Text>
                    <Text style={s.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Note ── */}
        <View style={s.note}>
          <Ionicons name="information-circle-outline" size={18} color={BRAND} />
          <Text style={s.noteText}>
            Need help? Contact us via the About page and we'll guide you through
            the process.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default HowTo;

const s = StyleSheet.create({
  header: {
    backgroundColor: DARK,
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 6,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(194,158,114,0.15)",
    borderWidth: 1,
    borderColor: "rgba(194,158,114,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  headerTitle: {
    color: "#F5EDE0",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 3,
  },
  headerSub: {
    color: "#C29E72",
    fontSize: 12,
    fontStyle: "italic",
  },

  timeline: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  stepRow: {
    flexDirection: "row",
    gap: 16,
  },

  stepLeft: {
    alignItems: "center",
    width: 36,
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DARK,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  stepNumber: {
    color: BRAND,
    fontWeight: "800",
    fontSize: 14,
  },
  connector: {
    flex: 1,
    width: 2,
    backgroundColor: "#EDE0D0",
    marginVertical: 4,
    minHeight: 24,
  },

  stepCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "#FAF6F1",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EDE0D0",
  },
  stepIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(194,158,114,0.15)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 19,
  },

  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "rgba(194,158,114,0.1)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(194,158,114,0.25)",
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: "#5a3e1c",
    lineHeight: 19,
  },
});
