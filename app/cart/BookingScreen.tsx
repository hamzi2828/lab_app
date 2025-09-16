import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BRAND_GREEN } from "../../constants/Colors";

// Define the date type
interface DateItem {
  day: string;
  date: number;
  month: string;
  id: number;
  fullDate: string;
  isToday: boolean;
}

const BookingScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<number>(1); // Default to first date
  const [selectedTime, setSelectedTime] = useState<string>("10:00 PM - 11:00 PM");
  const [address, setAddress] = useState<string>("");
  const [days, setDays] = useState<DateItem[]>([]);

  // Generate 30 days starting from today
  const generate30Days = (): DateItem[] => {
    const dates: DateItem[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      dates.push({
        day: dayNames[currentDate.getDay()],
        date: currentDate.getDate(),
        month: monthNames[currentDate.getMonth()],
        id: i + 1,
        fullDate: currentDate.toDateString(),
        isToday: i === 0,
      });
    }
    return dates;
  };

  // Initialize with 30 days starting from today
  React.useEffect(() => {
    const thirtyDays = generate30Days();
    setDays(thirtyDays);
  }, []);

  // Handle navigation to the next screen
  const handleNext = () => {
    // Save booking details to AsyncStorage or pass as params
    router.push("/cart/PaymentMethod" as any);
  };

  // Handle navigation back
  const handleBack = () => {
    router.back();
  };

  // Handle edit location
  const handleEditLocation = () => {
    // Implement location editing functionality
    console.log("Edit location pressed");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={BRAND_GREEN} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Booking</Text>
          <Text style={styles.headerSubtitle}>Home Sample Collection</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image 
            source={require('../../assets/icons/rider.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Date & Time Selection */}
        <View style={styles.selectionContainer}>
          <Text style={styles.sectionTitle}>Select Date & Time / وقت منتخب کریں</Text>
          
          {/* Date Selection */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScrollView}
          >
            {days.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.dateItem,
                  selectedDate === item.id && styles.selectedDateItem,
                  item.isToday && styles.todayItem,
                ]}
                onPress={() => setSelectedDate(item.id)}
              >
                <Text
                  style={[
                    styles.dayText,
                    item.isToday && selectedDate !== item.id && styles.todayText,
                    selectedDate === item.id && styles.selectedDayText,
                  ]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    item.isToday && selectedDate !== item.id && styles.todayText,
                    selectedDate === item.id && styles.selectedDateText,
                  ]}
                >
                  {item.date}
                </Text>
                <Text
                  style={[
                    styles.monthText,
                    item.isToday && selectedDate !== item.id && styles.todayText,
                    selectedDate === item.id && styles.selectedMonthText,
                  ]}
                >
                  {item.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time Selection */}
          <TouchableOpacity style={styles.timeSelector}>
            <Text style={styles.timeText}>{selectedTime}</Text>
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationTitle}>Booking Location</Text>
            <TouchableOpacity onPress={handleEditLocation}>
              <Text style={styles.editText}>Edit Location <Ionicons name="pencil-outline" size={16} color={BRAND_GREEN} /></Text>
            </TouchableOpacity>
          </View>
          
          {/* Map Preview */}
          <View style={styles.mapContainer}>
            <View style={styles.mapImage}>
              <Ionicons name="map-outline" size={80} color="#ccc" style={{alignSelf: 'center', marginTop: 30}} />
            </View>
            <View style={styles.mapPin}>
              <Ionicons name="location" size={24} color="#fff" />
            </View>
            <Text style={styles.locationName}>Rawalpindi</Text>
            <Text style={styles.mapLogo}>Maps</Text>
          </View>
        </View>

        {/* Address Input */}
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Enter Complete Address / مکمل پتہ درج کریں</Text>
          <TextInput
            style={styles.addressInput}
            placeholder="Enter Address / پتہ درج کریں"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFF5F7",
  },
  backButton: {
    padding: 5,
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  illustration: {
    width: 200,
    height: 100,
  },
  selectionContainer: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: BRAND_GREEN,
    marginBottom: 15,
  },
  dateScrollView: {
    flexDirection: "row",
    marginBottom: 15,
  },
  dateItem: {
    width: 55,
    height: 80,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    paddingVertical: 8,
  },
  selectedDateItem: {
    backgroundColor: BRAND_GREEN,
  },
  todayItem: {
    borderWidth: 2,
    borderColor: BRAND_GREEN,
  },
  dayText: {
    fontSize: 12,
    color: "#666",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  monthText: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  selectedDayText: {
    color: "#fff",
  },
  selectedDateText: {
    color: "#fff",
  },
  selectedMonthText: {
    color: "#fff",
  },
  todayText: {
    color: BRAND_GREEN,
    fontWeight: "bold",
  },
  timeSelector: {
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    alignSelf: "center",
    minWidth: 180,
  },
  timeText: {
    fontSize: 16,
    color: "#333",
  },
  locationContainer: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  editText: {
    fontSize: 14,
    color: BRAND_GREEN,
  },
  mapContainer: {
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapPin: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -12,
    marginTop: -24,
    backgroundColor: "#4285F4",
    borderRadius: 15,
    padding: 5,
  },
  locationName: {
    position: "absolute",
    top: "50%",
    left: "50%",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  mapLogo: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: 80,
    height: 20,
  },
  addressContainer: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: BRAND_GREEN,
    marginBottom: 15,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: BRAND_GREEN,
    margin: 15,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
    marginTop: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookingScreen;
