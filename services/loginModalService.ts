import { EventEmitter } from 'events';

export interface LoginModalOptions {
  title?: string;
  subtitle?: string;
  redirectPath?: string;
  benefits?: string[];
}

class LoginModalService extends EventEmitter {
  private isModalVisible = false;

  showLoginModal(options: LoginModalOptions = {}) {
    if (this.isModalVisible) return;

    this.isModalVisible = true;
    this.emit('showLoginModal', {
      title: options.title || "Login Required",
      subtitle: options.subtitle || "Please sign in to continue",
      redirectPath: options.redirectPath,
      benefits: options.benefits || [
        "Your data will be saved securely",
        "Track your activity history",
        "Faster future access"
      ]
    });
  }

  hideLoginModal() {
    this.isModalVisible = false;
    this.emit('hideLoginModal');
  }

  isVisible() {
    return this.isModalVisible;
  }

  // Convenience methods for common scenarios
  showForAddresses(action: string = "manage addresses") {
    this.showLoginModal({
      title: "Sign In Required",
      subtitle: `Please sign in to ${action}`,
      benefits: [
        "Save multiple delivery addresses",
        "Set default delivery location",
        "Quick address selection for orders"
      ]
    });
  }

  showForBooking() {
    this.showLoginModal({
      title: "Sign In to Book",
      subtitle: "Create an account to book your tests",
      benefits: [
        "Track your booking history",
        "Receive booking confirmations",
        "Get test results notifications"
      ]
    });
  }

  showForProfile(action: string = "access your profile") {
    this.showLoginModal({
      title: "Account Required",
      subtitle: `Please sign in to ${action}`,
      benefits: [
        "View your profile information",
        "Update personal details",
        "Manage account preferences"
      ]
    });
  }
}

export default new LoginModalService();