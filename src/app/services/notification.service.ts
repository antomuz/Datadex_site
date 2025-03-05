import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: { message: string }[] = [];

  constructor() {}

  showError(message: string) {
    // Push a new notification
    this.notifications.push({ message });

    // Remove it automatically after 3s
    setTimeout(() => {
      this.notifications.shift();
    }, 3000);
  }
}
