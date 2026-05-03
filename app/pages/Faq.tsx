import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggle = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "How does clothing rental work?",
      a: "You browse our collection, choose your desired outfit, select your size and rental period, and we deliver it to your doorstep. After you're done, just send it back using the prepaid return label — we handle the cleaning!",
    },
    {
      q: "What if the outfit doesn’t fit me?",
      a: "We recommend adding a backup size for free (if available) to ensure the best fit. If neither size works, contact us within 24 hours for an exchange or credit.",
    },
    {
      q: "Do I need to wash the clothes before returning them?",
      a: "Nope! Cleaning is on us. Every item is professionally cleaned and inspected before and after each rental.",
    },
    {
      q: "How long can I rent an item for?",
      a: "You can choose from 3, 5, or 7 days. Need longer? Just select your preferred rental period during checkout.",
    },
    {
      q: "What happens if I damage the item?",
      a: "Minor wear and tear is covered. Major damage or loss may result in charges. Damage protection is available at checkout.",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* NAVBAR */}
      <Navbar onMenuPress={() => setSidebarVisible(true)} />

      {/* SIDEBAR */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      {/* CONTENT */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>FREQUENTLY ASKED QUESTIONS</Text>

        {/* FAQ LIST */}
        {faqs.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.question}>{item.q}</Text>
            <Text style={styles.answer}>{item.a}</Text>
          </View>
        ))}

        {/* RENTAL POLICY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RENTAL POLICY</Text>
          <Text style={styles.text}>
            At Soliel Laluna Boutique, rentals are available for 3, 5, or 7-day
            periods starting from delivery day. We recommend ordering 5–7 days
            before your event. All items are cleaned and inspected before and
            after rental. Minor wear is covered, but major damage or loss may
            result in charges. Optional damage protection is available.
          </Text>
        </View>

        {/* RETURN POLICY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RETURN & EXCHANGE POLICY</Text>
          <Text style={styles.text}>
            Items must be returned on or before the last rental day using the
            prepaid label. Late returns may incur fees. Contact us within 24
            hours if you need an exchange. Items returned damaged, incomplete,
            or late may be charged accordingly. Refunds are usually issued as
            store credit.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Faq;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },

  question: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },

  answer: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    lineHeight: 20,
  },

  section: {
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },

  text: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
