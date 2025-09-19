import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BRAND_GREEN } from '../constants/Colors';

interface BookingSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  bookingId: string;
  onOkPress?: () => void;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  visible,
  onClose,
  bookingId,
  onOkPress
}) => {
  const router = useRouter();

  const handleOkPress = () => {
    onClose();
    if (onOkPress) {
      onOkPress();
    } else {
      router.push('/home/HomePageScreen');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Success Animation Icon */}
          <View style={styles.successIconContainer}>
            <LinearGradient
              colors={['#3c5e45', '#0d9b1e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.successIconGradient}
            >
              <Ionicons name="checkmark-circle" size={48} color="#fff" />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.modalTitle}>Booking Successful!</Text>

          {/* Success Message */}
          <Text style={styles.modalSubtitle}>
            Your booking has been submitted successfully
          </Text>

          {/* Booking ID Card */}
          <View style={styles.bookingIdCard}>
            <View style={styles.bookingIdHeader}>
              <Ionicons name="receipt-outline" size={20} color={BRAND_GREEN} />
              <Text style={styles.bookingIdLabel}>Booking Reference</Text>
            </View>
            <Text style={styles.bookingIdValue}>{bookingId}</Text>
          </View>

          {/* Info Items */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.infoText}>You will receive a confirmation SMS shortly</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={18} color="#666" />
              <Text style={styles.infoText}>Our team will contact you to confirm the appointment</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="document-text-outline" size={18} color="#666" />
              <Text style={styles.infoText}>Test reports will be available in your profile</Text>
            </View>
          </View>

          {/* OK Button with Gradient */}
          <TouchableOpacity
            onPress={handleOkPress}
            activeOpacity={0.8}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={['#3c5e45', '#0d9b1e']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.okButton}
            >
              <Text style={styles.okButtonText}>OK</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  successIconContainer: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  successIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0d9b1e',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  bookingIdCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  bookingIdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingIdLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 8,
    fontWeight: '600',
  },
  bookingIdValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: 1,
  },
  infoContainer: {
    marginBottom: 28,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  buttonWrapper: {
    width: '100%',
  },
  okButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#3c5e45',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  okButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});

export default BookingSuccessModal;