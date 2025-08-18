import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BRAND_GREEN } from "../constants/Colors";

export type TabKey = "general" | "all" | "packages" | "diseases";

type Props = {
  title?: string;
  selectedCity: string;
  onBack?: () => void;
  onCityPress?: () => void; // open picker/modal externally
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  search: string;
  onSearchChange: (v: string) => void;
};

const TestSearchHeader: React.FC<Props> = ({
  title = "Test Search & Booking In",
  selectedCity,
  onBack,
  onCityPress,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
}) => {
  return (
    <View style={styles.wrap}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={24} color={BRAND_GREEN} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* City Selector */}
      <TouchableOpacity style={styles.cityBtn} activeOpacity={0.8} onPress={onCityPress}>
        <Text style={styles.cityText}>{selectedCity}</Text>
        <Ionicons name="chevron-down" size={18} color={BRAND_GREEN} />
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Tab
          label="General Tests"
          icon={<MaterialCommunityIcons name="test-tube" size={24} color={activeTab === "general" ? BRAND_GREEN : "#9ec9ae"} />}
          active={activeTab === "general"}
          onPress={() => onTabChange("general")}
        />
        <Tab
          label="All Tests"
          icon={<Ionicons name="water-outline" size={24} color={activeTab === "all" ? BRAND_GREEN : "#9ec9ae"} />}
          active={activeTab === "all"}
          onPress={() => onTabChange("all")}
        />
        <Tab
          label="All Packages"
          icon={<Ionicons name="cube-outline" size={24} color={activeTab === "packages" ? "#fff" : "#9ec9ae"} />}
          active={activeTab === "packages"}
          highlight
          onPress={() => onTabChange("packages")}
        />
        <Tab
          label="Diseases"
          icon={<Ionicons name="star-outline" size={24} color={activeTab === "diseases" ? BRAND_GREEN : "#9ec9ae"} />}
          active={activeTab === "diseases"}
          onPress={() => onTabChange("diseases")}
        />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#9aa0a6" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for test..."
          value={search}
          onChangeText={onSearchChange}
          placeholderTextColor="#9aa0a6"
        />
      </View>
    </View>
  );
};

const Tab = ({ label, icon, active, onPress, highlight }: { label: string; icon: React.ReactNode; active: boolean; onPress: () => void; highlight?: boolean }) => {
  return (
    <TouchableOpacity style={[styles.tab, highlight && styles.tabHighlight]} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.tabIcon, highlight && styles.tabIconHighlight]}>
        {icon}
      </View>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#e6f4ea",
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  cityBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#cfe9db",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cityText: {
    marginRight: 6,
    color: "#333",
    fontWeight: "600",
  },
  tabsRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  tabHighlight: {
    
  },
  tabIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "#cfe9db",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f4ea",
  },
  tabIconHighlight: {
    backgroundColor: BRAND_GREEN,
    borderColor: BRAND_GREEN,
  },
  tabLabel: {
    marginTop: 6,
    color: "#777",
    fontSize: 12,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: "#333",
  },
  searchWrap: {
    marginTop: 16,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#111",
  },
});

export default TestSearchHeader;
