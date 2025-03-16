/**
 * NotificationService - A service to handle Chrome notifications
 * Uses singleton pattern for consistent access throughout the extension
 */

// Define types for notification options
export interface NotificationOptions {
  type: chrome.notifications.TemplateType;
  title: string;
  message: string;
  iconUrl?: string;
  contextMessage?: string;
  priority?: number;
  eventTime?: number;
  buttons?: chrome.notifications.ButtonOptions[];
  imageUrl?: string;
  items?: chrome.notifications.ItemOptions[];
  progress?: number;
  requireInteraction?: boolean;
  silent?: boolean;
}

export class NotificationService {
  private static instance: NotificationService;
  private readonly defaultIcon: string = 'icon-128.png'; // Default icon path
  private readonly DEFAULT_NOTIFICATION_ID_PREFIX = 'udemy_coupon_notification_';

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.setupEventListeners();
  }

  /**
   * Get the singleton instance of NotificationService
   */
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Create a notification with the given options
   * @param options Notification options
   * @param id Optional notification ID (will generate one if not provided)
   * @returns Promise that resolves to the notification ID
   */
  public async createNotification(options: NotificationOptions, id?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const notificationId = id ?? `${this.DEFAULT_NOTIFICATION_ID_PREFIX}${Date.now()}`;
      
      const notificationOptions: chrome.notifications.NotificationOptions = {
        type: options.type,
        iconUrl: options.iconUrl ?? this.defaultIcon,
        title: options.title,
        message: options.message,
        contextMessage: options.contextMessage,
        priority: options.priority,
        eventTime: options.eventTime,
        buttons: options.buttons,
        imageUrl: options.imageUrl,
        items: options.items,
        progress: options.progress,
        requireInteraction: options.requireInteraction,
        silent: options.silent
      };

      chrome.notifications.create(notificationId, notificationOptions as chrome.notifications.NotificationOptions<true>, (id) => {
        if (chrome.runtime.lastError) {
          const errorMessage = chrome.runtime.lastError.message ?? 'Unknown Chrome notification error';
          reject(new Error(errorMessage));
        } else {
          resolve(id);
        }
      });
    });
  }

  /**
   * Create a simple notification with basic information
   * @param title Notification title
   * @param message Notification message
   * @returns Promise that resolves to the notification ID
   */
  public async createSimpleNotification(title: string, message: string): Promise<string> {
    return this.createNotification({
      type: 'basic',
      title,
      message,
      requireInteraction: false
    });
  }

  /**
   * Update an existing notification
   * @param id Notification ID
   * @param options New notification options
   * @returns Promise that resolves to a boolean indicating success
   */
  public async updateNotification(id: string, options: NotificationOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const notificationOptions: chrome.notifications.NotificationOptions = {
        type: options.type,
        iconUrl: options.iconUrl ?? this.defaultIcon,
        title: options.title,
        message: options.message,
        contextMessage: options.contextMessage,
        priority: options.priority,
        eventTime: options.eventTime,
        buttons: options.buttons,
        imageUrl: options.imageUrl,
        items: options.items,
        progress: options.progress,
        requireInteraction: options.requireInteraction,
        silent: options.silent
      };

      chrome.notifications.update(id, notificationOptions as chrome.notifications.NotificationOptions<true>, (wasUpdated) => {
        if (chrome.runtime.lastError) {
          const errorMessage = chrome.runtime.lastError.message ?? 'Unknown Chrome notification error';
          reject(new Error(errorMessage));
        } else {
          resolve(wasUpdated);
        }
      });
    });
  }

  /**
   * Clear a specific notification
   * @param id Notification ID
   * @returns Promise that resolves to a boolean indicating success
   */
  public async clearNotification(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      chrome.notifications.clear(id, (wasCleared) => {
        if (chrome.runtime.lastError) {
          const errorMessage = chrome.runtime.lastError.message ?? 'Unknown Chrome notification error';
          reject(new Error(errorMessage));
        } else {
          resolve(wasCleared);
        }
      });
    });
  }

  /**
   * Get all active notifications
   * @returns Promise that resolves to an object mapping notification IDs to their options
   */
  public async getAllNotifications(): Promise<Record<string, chrome.notifications.NotificationOptions>> {
    return new Promise((resolve, reject) => {
      chrome.notifications.getAll((notifications) => {
        if (chrome.runtime.lastError) {
          const errorMessage = chrome.runtime.lastError.message ?? 'Unknown Chrome notification error';
          reject(new Error(errorMessage));
        } else {
          resolve(notifications as Record<string, chrome.notifications.NotificationOptions>);
        }
      });
    });
  }

  /**
   * Clear all active notifications
   * @returns Promise that resolves when all notifications are cleared
   */
  public async clearAllNotifications(): Promise<void> {
    const notifications = await this.getAllNotifications();
    const clearPromises = Object.keys(notifications).map(id => this.clearNotification(id));
    await Promise.all(clearPromises);
  }

  /**
   * Set up event listeners for notification interactions
   */
  private setupEventListeners(): void {
    // Listen for notification clicks
    chrome.notifications.onClicked.addListener((notificationId) => {
      console.log(`Notification clicked: ${notificationId}`);
      // You can implement custom behavior here
    });

    // Listen for notification button clicks
    chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
      console.log(`Button ${buttonIndex} clicked on notification: ${notificationId}`);
      // You can implement custom behavior here
    });

    // Listen for notification closed events
    chrome.notifications.onClosed.addListener((notificationId, byUser) => {
      console.log(`Notification ${notificationId} closed. By user: ${byUser}`);
      // You can implement custom behavior here
    });
  }

  /**
   * Create a notification for a new Udemy coupon
   * @param courseTitle The title of the course
   * @param couponCode The coupon code
   * @param expirationDate Optional expiration date
   * @returns Promise that resolves to the notification ID
   */
  public async notifyCoupon(courseTitle: string, couponCode: string, expirationDate?: Date): Promise<string> {
    const expirationMessage = expirationDate 
      ? `Expires on: ${expirationDate.toLocaleDateString()}`
      : 'Limited time offer';
      
    return this.createNotification({
      type: 'basic',
      title: 'Udemy Coupon Available!',
      message: `${courseTitle}\n\nCoupon Code: ${couponCode}\n${expirationMessage}`,
      contextMessage: 'Click to open course',
      requireInteraction: true,
      buttons: [
        { title: 'Copy Coupon' },
        { title: 'Dismiss' }
      ]
    });
  }

  /**
   * Show a notification for a batch of new coupons
   * @param count Number of new coupons
   * @returns Promise that resolves to the notification ID
   */
  public async notifyNewCoupons(count: number): Promise<string> {
    return this.createNotification({
      type: 'basic',
      title: 'New Udemy Coupons Available!',
      message: `${count} new course coupons have been added.`,
      requireInteraction: false,
      buttons: [
        { title: 'View All' }
      ]
    });
  }
}
