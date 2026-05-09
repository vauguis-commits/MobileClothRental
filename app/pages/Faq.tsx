import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";

const BRAND = "#C29E72";
const DARK = "#4c3829";

const FAQS = [
  {
    q: "How does clothing rental work?",
    a: "Browse our collection, choose your outfit, select your size and rental period, and we'll deliver it to you. After use, return it with the prepaid label — we handle the cleaning.",
  },
  {
    q: "What if the outfit doesn't fit me?",
    a: "We recommend adding a backup size (if available). If neither fits, contact us within 24 hours for an exchange or store credit.",
  },
  {
    q: "Do I need to wash the clothes before returning?",
    a: "No! Cleaning is on us. Every item is professionally cleaned and inspected before and after each rental.",
  },
  {
    q: "How long can I rent an item for?",
    a: "You can choose from 3, 5, or 7 days. Select your preferred period during checkout.",
  },
  {
    q: "What happens if I damage the item?",
    a: "Minor wear and tear is covered. Major damage or loss may result in charges. Optional damage protection is available at checkout.",
  },
];

type Policy = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
};

const POLICIES: Policy[] = [
  {
    icon: "document-text-outline",
    title: "Rental Policy",
    body: "Rentals are available for 3, 5, or 7-day periods from delivery day. Order 5–7 days before your event. All items are cleaned and inspected. Minor wear is covered; major damage or loss may incur charges.",
  },
  {
    icon: "refresh-circle-outline",
    title: "Return & Exchange Policy",
    body: "Items must be returned on or before the last rental day using the prepaid label. Late returns may incur fees. Contact us within 24 hours for exchanges. Refunds are typically issued as store credit.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

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
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={28}
              color={BRAND}
            />
          </View>
          <Text style={s.headerTitle}>FAQ</Text>
          <Text style={s.headerSub}>Frequently asked questions</Text>
        </View>

        {/* ── Accordion ── */}
        <View style={s.section}>
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <View key={i} style={[s.accordionItem, open && s.accordionOpen]}>
                <TouchableOpacity
                  style={s.accordionHeader}
                  activeOpacity={0.7}
                  onPress={() => toggle(i)}
                >
                  <View style={s.qIconBox}>
                    <Ionicons name="help-outline" size={16} color={BRAND} />
                  </View>
                  <Text style={s.question}>{item.q}</Text>
                  <Ionicons
                    name={open ? "chevron-up-outline" : "chevron-down-outline"}
                    size={18}
                    color="#999"
                  />
                </TouchableOpacity>

                {open && (
                  <View style={s.accordionBody}>
                    <Text style={s.answer}>{item.a}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ── Policies ── */}
        <View style={s.section}>
          <View style={s.sectionLabel}>
            <Ionicons name="shield-checkmark-outline" size={18} color={BRAND} />
            <Text style={s.sectionLabelText}>Policies</Text>
          </View>

          {POLICIES.map((p, i) => (
            <View key={i} style={s.policyCard}>
              <View style={s.policyTitleRow}>
                <View style={s.policyIconBox}>
                  <Ionicons name={p.icon} size={20} color={BRAND} />
                </View>
                <Text style={s.policyTitle}>{p.title}</Text>
              </View>
              <Text style={s.policyBody}>{p.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Faq;

const s = StyleSheet.create({
  header: {
    backgroundColor: DARK,
    alignItems: "center",
    paddingVertical: 28,
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
    letterSpacing: 4,
  },
  headerSub: {
    color: "#C29E72",
    fontSize: 12,
    fontStyle: "italic",
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 10,
  },
  sectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionLabelText: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    letterSpacing: 0.5,
  },

  // accordion
  accordionItem: {
    backgroundColor: "#FAF6F1",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EDE0D0",
    overflow: "hidden",
  },
  accordionOpen: {
    borderColor: BRAND,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  qIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(194,158,114,0.15)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1E1209",
    lineHeight: 20,
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 2,
    borderTopWidth: 1,
    borderTopColor: "#EDE0D0",
  },
  answer: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
    paddingTop: 10,
  },

  // policy cards
  policyCard: {
    backgroundColor: "#FAF6F1",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EDE0D0",
    gap: 10,
  },
  policyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  policyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(194,158,114,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  policyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
  },
  policyBody: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
});
