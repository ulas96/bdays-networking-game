// Types of notifications
type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Notification interface
interface Notification {
  type: NotificationType;
  message: string;
  duration?: number;
}

export class NotificationManager {
  // Default duration for notifications in milliseconds
  private static DEFAULT_DURATION = 3000;
  
  // Create notification element
  private static createNotificationElement(notification: Notification): HTMLDivElement {
    const { type, message, duration = this.DEFAULT_DURATION } = notification;
    
    // Create notification element
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification notification-${type}`;
    
    // Create message element
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    
    // Add event listener to close button
    closeButton.addEventListener('click', () => {
      this.removeNotification(notificationElement);
    });
    
    // Append elements to notification
    notificationElement.appendChild(messageElement);
    notificationElement.appendChild(closeButton);
    
    // Auto-remove after duration
    setTimeout(() => {
      this.removeNotification(notificationElement);
    }, duration);
    
    return notificationElement;
  }
  
  // Remove notification
  private static removeNotification(notificationElement: HTMLDivElement): void {
    // Add fade-out class for animation
    notificationElement.classList.add('fade-out');
    
    // Remove element after animation completes
    setTimeout(() => {
      if (notificationElement.parentElement) {
        notificationElement.parentElement.removeChild(notificationElement);
      }
    }, 300); // Animation duration
  }
  
  // Show notification
  private static show(notification: Notification): void {
    if (typeof document === 'undefined') return; // Check for browser environment
    
    // Get or create notification container
    let container = document.getElementById('notification-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      document.body.appendChild(container);
    }
    
    // Create and append notification
    const notificationElement = this.createNotificationElement(notification);
    container.appendChild(notificationElement);
  }
  
  // Show success notification
  static success(message: string, duration?: number): void {
    this.show({
      type: 'success',
      message,
      duration
    });
  }
  
  // Show error notification
  static error(message: string, duration?: number): void {
    this.show({
      type: 'error',
      message,
      duration
    });
  }
  
  // Show info notification
  static info(message: string, duration?: number): void {
    this.show({
      type: 'info',
      message,
      duration
    });
  }
  
  // Show warning notification
  static warning(message: string, duration?: number): void {
    this.show({
      type: 'warning',
      message,
      duration
    });
  }
} 