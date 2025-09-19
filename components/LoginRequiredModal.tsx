import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BRAND_GREEN } from '../constants/Colors';

interface LoginRequiredModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  redirectPath?: string;
  benefits?: string[];
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  visible,
  onClose,
  title = "Login Required",
  subtitle = "Please sign in to continue",
  redirectPath,
  benefits = [
    "Your data will be saved securely",
    "Track your activity history",
    "Faster future access"
  ]
}) => {
  const router = useRouter();

  const handleSignIn = () => {
    onClose();
    const loginPath = redirectPath
      ? `/auth/LoginScreen?redirect=${encodeURIComponent(redirectPath)}`
      : '/auth/LoginScreen';
    router.push(loginPath as any);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.loginModalContainer}>
          {/* Header */}
          <View style={styles.loginModalHeader}>
            <LinearGradient
              colors={['#3c5e45', '#0d9b1e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginIconContainer}
            >
              <Ionicons name="lock-closed" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.loginModalTitle}>{title}</Text>
            <Text style={styles.loginModalSubtitle}>{subtitle}</Text>
          </View>

          {/* Content */}
          <View style={styles.loginModalContent}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.loginBenefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={BRAND_GREEN} />
                <Text style={styles.loginBenefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.loginModalActions}>
            <TouchableOpacity
              style={styles.loginCancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.loginCancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignIn}
              activeOpacity={0.8}
              style={{ flex: 1 }}
            >
              <LinearGradient
                colors={['#3c5e45', '#0d9b1e']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.loginConfirmButton}
              >
                <Text style={styles.loginConfirmButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  loginModalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loginIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0d9b1e',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  loginModalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  loginModalContent: {
    marginBottom: 32,
  },
  loginBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  loginBenefitText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  loginModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  loginCancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  loginConfirmButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#3c5e45',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginConfirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default LoginRequiredModal;