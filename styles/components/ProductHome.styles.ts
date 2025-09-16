import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  row: {
    justifyContent: "space-between",
  },
  viewAllButton: {
    marginTop: 8,
    marginHorizontal: 10,
    marginBottom: 16,
    height: 40,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#0d9b1e",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  viewAllText: {
    color: "#0d9b1e",
    fontSize: 14,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});