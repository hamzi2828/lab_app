import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#777",
    marginVertical: 2,
  },
  phone: {
    fontSize: 14,
    color: "#777",
  },
  edit: {
    fontSize: 14,
    color: "#0d9b1e",
    fontWeight: "600",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  signOut: {
    marginTop: 20,
    alignItems: "center",
  },
  signOutText: {
    fontSize: 16,
    color: "#ff0000",
    fontWeight: "600",
  },
  username: {
    fontSize: 14,
    color: "#0d9b1e",
    marginTop: 2,
    fontWeight: "500",
  },
  notLoggedInContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notLoggedInText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  signInButton: {
    backgroundColor: "#0d9b1e",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signInText: {
    fontSize: 16,
    color: "#0d9b1e",
    fontWeight: "600",
  },
});