import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  price: {
    marginTop: 4,
    fontSize: 12,
    color: "#0d9b1e",
    fontWeight: "700",
  },
  bookBtn: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#0d9b1e",
    justifyContent: "center",
    alignItems: "center",
  },
  bookText: {
    color: "#0d9b1e",
    fontSize: 12,
    fontWeight: "700",
  },
  code: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  category: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    textTransform: "capitalize",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  loadMoreContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadMoreBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  loadMoreText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  paginationInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  paginationText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 11,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 6,
  },
  discountedPrice: {
    fontSize: 12,
    color: "#0d9b1e",
    fontWeight: "700",
  },
  cancelBtn: {
    backgroundColor: "#0d9b1e",
    borderColor: "#0d9b1e",
  },
  cancelText: {
    color: "#fff",
  },
});