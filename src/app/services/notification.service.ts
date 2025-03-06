import { Injectable } from '@angular/core';

export interface AppNotification {
  message: string;
  type: string;      // e.g., 'success' | 'error' | 'info'
  duration: number;  // ms
  id: number;        // unique id for tracking
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: AppNotification[] = [];
  maxNotifications = 5;
  private nextId = 0;

  constructor() {}

  createNotification(message: string, type = 'success', duration = 2500) {
    // If at max capacity, remove the oldest
    if (this.notifications.length >= this.maxNotifications) {
      this.removeNotification(this.notifications[0].id);
    }

    const notif: AppNotification = {
      message,
      type,
      duration,
      id: this.nextId++
    };

    this.notifications.push(notif);

    // Auto-remove after `duration`
    setTimeout(() => {
      this.removeNotification(notif.id);
    }, duration);
  }

  removeNotification(id: number) {
    // Fade out handled in component; here we just remove from array
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  // Helper methods for convenience
  showSuccess(msg: string, duration = 3500) {
    this.createNotification(msg, 'success', duration);
  }
  showError(msg: string, duration = 3500) {
    this.createNotification(msg, 'error', duration);
  }
  showInfo(msg: string, duration = 3500) {
    this.createNotification(msg, 'info', duration);
  }
}
