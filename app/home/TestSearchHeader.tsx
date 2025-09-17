import React from "react";
import { View, Text, TouchableOpacity, TextInput, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BRAND_GREEN } from "../../constants/Colors";
import { styles } from "../../styles/alltest/TestSearchHeader.styles";

export type TabKey = "all-tests" | "blood-tests" | "radiology" | "all-packages";

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
    <SafeAreaView style={styles.safeWrap} edges={["top", "left", "right"]}>
      <View style={[
        styles.wrap,
        Platform.OS === "android" && { paddingTop: Math.max((StatusBar.currentHeight || 0) - 12, 0) }
      ]}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={24} color={BRAND_GREEN} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* City Selector */}
      <TouchableOpacity style={[styles.cityBtn, { alignSelf: 'center' }]} activeOpacity={0.8} onPress={onCityPress}>
        <Text style={styles.cityText}>{selectedCity}</Text>
        <Ionicons name="chevron-down" size={18} color={BRAND_GREEN} />
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Tab
          label="All Tests"
          icon={<MaterialCommunityIcons name="test-tube" size={24} color={activeTab === "all-tests" ? "#fff" : "#9ec9ae"} />}
          active={activeTab === "all-tests"}
          onPress={() => onTabChange("all-tests")}
        />
        <Tab
          label="blood Tests"
          icon={<Ionicons name="water-outline" size={24} color={activeTab === "blood-tests" ? "#fff" : "#9ec9ae"} />}
          active={activeTab === "blood-tests"}
          onPress={() => onTabChange("blood-tests")}
        />
     <Tab
          label="Radiology"
          icon={<Ionicons name="radio-outline" size={24} color={activeTab === "radiology" ? "#fff" : "#9ec9ae"} />}
          active={activeTab === "radiology"}
          onPress={() => onTabChange("radiology")}
        />
      <Tab
          label="All Packages"
          icon={<Ionicons name="cube-outline" size={24} color={activeTab === "all-packages" ? "#fff" : "#9ec9ae"} />}
          active={activeTab === "all-packages"}
          onPress={() => onTabChange("all-packages")}
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
    </SafeAreaView>
  );
};

const Tab = ({ label, icon, active, onPress }: { label: string; icon: React.ReactNode; active: boolean; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.tab} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.tabIcon, active && styles.tabIconActive]}>
        {icon}
      </View>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default TestSearchHeader;
