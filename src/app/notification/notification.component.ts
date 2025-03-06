import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notif of notificationService.notifications" 
        class="notification {{ notif.type }}"
        (click)="onNotificationClick(notif.id)"
      >
        <span>{{ notif.message }}</span>
        <button 
          class="close-btn" 
          (click)="onCloseClick($event, notif.id)"
        >
          &times;
        </button>

        <!-- The progress bar matches the toast's duration -->
        <div 
          class="progress" 
          [style.animation-duration]="notif.duration + 'ms'"
        ></div>
      </div>
    </div>
  `,
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(public notificationService: NotificationService) {}

  ngOnInit(): void {}

  onNotificationClick(id: number) {
    // If user clicks the entire notification
    this.notificationService.removeNotification(id);
  }

  onCloseClick(event: Event, id: number) {
    // Stop the parent .notification click from firing
    event.stopPropagation();
    this.notificationService.removeNotification(id);
  }
}
