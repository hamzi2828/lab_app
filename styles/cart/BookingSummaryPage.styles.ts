import { StyleSheet, Dimensions } from 'react-native';
import { BRAND_GREEN } from '../../constants/Colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Header Styles (inspired by Profile.tsx)
  headerSection: {
    position: 'relative',
    height: 120,
    marginBottom: -10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: BRAND_GREEN,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Status Card (like Profile card)
  statusCard: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: `${BRAND_GREEN}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },

  // Summary Sections (like Profile menu items)
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  testCountBadge: {
    backgroundColor: BRAND_GREEN,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
    elevation: 2,
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  testCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  // Tests Container
  testsContainer: {
    marginBottom: 5,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  lastTestItem: {
    borderBottomWidth: 0,
  },
  testIconContainer: {
    width: 15,
    height: 15,
    borderRadius: 0,
    backgroundColor: `${BRAND_GREEN}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 10,
  },
  testInfo: {
    flex: 1,
    marginRight: 12,
    flexShrink: 1,
  },
  testName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  testDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  priceContainer: {
    marginLeft: 'auto',
    paddingLeft: 12,
    alignSelf: 'flex-start',
  },
  testPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND_GREEN,
  },

  // Total Container
  totalContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
  },
  subtotalPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  freeText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_GREEN,
  },
  divider: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND_GREEN,
  },
  // Schedule Container
  scheduleContainer: {
    gap: 12,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  scheduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
    marginBottom: 4,
  },
  scheduleValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  // Address Container
  addressCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  addressMainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressDetails: {
    flex: 1,
  },
  addressTypeContainer: {
    marginBottom: 8,
  },
  addressTypeTag: {
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  addressTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 22,
    fontWeight: '500',
  },
  noAddressContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noAddressText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 12,
    fontWeight: '500',
  },
  // Note Container
  noteContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  noteIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  noteTextContainer: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#856404',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },

  // Submit Container (like Profile sign-in button)
  submitContainer: {
    paddingBottom: 32,
    marginTop: 10,
  },
  submitButton: {
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#3c5e45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonEnabled: {
    backgroundColor: BRAND_GREEN,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },

});