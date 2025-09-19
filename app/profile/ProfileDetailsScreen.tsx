import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { getUserData, isUserLoggedIn } from "../../services/loginValidation";
import { StyleSheet } from "react-native";

const ProfileDetailsScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        const data = await getUserData();
        setUserData(data);
      } else {
        router.back();
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert("Error", "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.infoCard}>
      <Text style={styles.infoCardTitle}>{title}</Text>
      <View style={styles.infoCardContent}>
        {children}
      </View>
    </View>
  );

  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoRowLeft}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={icon as any} size={20} color="#0d9b1e" />
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value || "Not provided"}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d9b1e" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#ccc" />
        <Text style={styles.errorText}>Unable to load profile data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d9b1e" />

      {/* Header */}
      <LinearGradient
        colors={['#3c5e45', '#0d9b1e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile Details</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert("Edit Profile", "Edit functionality coming soon!")}
        >
          <MaterialIcons name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Avatar Section */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={['#3c5e45', '#0d9b1e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarContainer}
          >
            <Text style={styles.avatarText}>
              {getInitials(userData.name || "User")}
            </Text>
          </LinearGradient>

          <Text style={styles.userName}>{userData.name || "User Name"}</Text>
          <Text style={styles.userRole}>Patient</Text>

          <View style={styles.statusBadge}>
            <MaterialIcons name="verified" size={16} color="#0d9b1e" />
            <Text style={styles.statusText}>Verified Account</Text>
          </View>
        </View>

        {/* Personal Information */}
        <InfoCard title="Personal Information">
          <InfoRow
            icon="person"
            label="Full Name"
            value={userData.name}
          />
          <InfoRow
            icon="alternate-email"
            label="Username"
            value={userData.username}
          />
          <InfoRow
            icon="cake"
            label="Date of Birth"
            value={formatDate(userData.dateOfBirth)}
          />
          <InfoRow
            icon="person-outline"
            label="Gender"
            value={userData.gender}
          />
        </InfoCard>

        {/* Contact Information */}
        <InfoCard title="Contact Information">
          <InfoRow
            icon="email"
            label="Email Address"
            value={userData.email}
          />
          <InfoRow
            icon="phone"
            label="Phone Number"
            value={userData.phone}
          />
          <InfoRow
            icon="location-on"
            label="Address"
            value={userData.address}
          />
        </InfoCard>

        {/* Medical Information */}
        <InfoCard title="Medical Information">
          <InfoRow
            icon="medical-services"
            label="Blood Group"
            value={userData.bloodGroup}
          />
          <InfoRow
            icon="accessible"
            label="Medical Conditions"
            value={userData.medicalConditions || "None reported"}
          />
          <InfoRow
            icon="medication"
            label="Allergies"
            value={userData.allergies || "None reported"}
          />
        </InfoCard>

        {/* Account Information */}
        <InfoCard title="Account Information">
          <InfoRow
            icon="event"
            label="Member Since"
            value={formatDate(userData.createdAt)}
          />
          <InfoRow
            icon="history"
            label="Last Login"
            value={formatDate(userData.lastLogin)}
          />
          <InfoRow
            icon="confirmation-number"
            label="Patient ID"
            value={userData.id?.toString() || "N/A"}
          />
        </InfoCard>

        {/* Emergency Contact */}
        <InfoCard title="Emergency Contact">
          <InfoRow
            icon="contact-emergency"
            label="Contact Name"
            value={userData.emergencyContactName}
          />
          <InfoRow
            icon="phone"
            label="Contact Phone"
            value={userData.emergencyContactPhone}
          />
          <InfoRow
            icon="family-restroom"
            label="Relationship"
            value={userData.emergencyContactRelation}
          />
        </InfoCard>

        {/* Action Button */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => Alert.alert("Edit Profile", "Edit functionality coming soon!")}>
            <LinearGradient
              colors={['#3c5e45', '#0d9b1e']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.actionButton}
            >
              <MaterialIcons name="edit" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#0d9b1e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fff4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0d9b1e",
  },
  statusText: {
    fontSize: 14,
    color: "#0d9b1e",
    fontWeight: "600",
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  infoCardContent: {
    paddingBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0fff4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  bottomSpacing: {
    height: 32,
  },
});

export default ProfileDetailsScreen;