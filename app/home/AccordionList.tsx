import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const AccordionItem = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.accordionItem}>
      {/* Header Section */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.title}>{title}</Text>
        <FontAwesome
          name={isExpanded ? "minus" : "plus"}
          size={14}
          color="green"
        />
      </TouchableOpacity>

      {/* Content Section */}
      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const AccordionList = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AccordionItem
        title="Product Summary"
        content="This is the product summary content."
      />
      <AccordionItem
        title="Product Specification"
        content="This is the product specification content."
      />
      <AccordionItem
        title="Perks and Benefits Included"
        content="This is the perks and benefits content."
      />
      <AccordionItem
        title="Product Description"
        content="This is the product description content."
      />
      <AccordionItem title="FAQ’S" content="This is the FAQ content." />
      <AccordionItem title="Reviews" content="This is the reviews content." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    color: "#000",
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
  },
  contentText: {
    fontSize: 14,
    color: "#666",
  },
});

export default AccordionList;
