import { StyleSheet } from "react-native";
import { BRAND_GREEN } from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  containerShowBooking: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -30,
  },
  flatListContainer: {
    paddingBottom: 150, // Add bottom padding to avoid overlap with footer
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  couponContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  closeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  applyButtonText: {
    color: "#333",
  },
  orderSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionBar: {
    flexDirection: "row",
    marginTop: 10,
    borderRadius: 24,
    overflow: "hidden",
  },
  actionSegment: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLeft: {
    backgroundColor: "#ECECEC",
  },
  actionRight: {
    backgroundColor: BRAND_GREEN,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionTextMuted: {
    color: "#333",
  },
  actionTextPrimary: {
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressItem: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  addressType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  addressName: {
    fontSize: 14,
    color: "#333",
  },
  addressDetails: {
    fontSize: 12,
    color: "#666",
  },
  addNewAddress: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 15,
  },
  bookingHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: BRAND_GREEN,
    fontWeight: "600",
  },
});