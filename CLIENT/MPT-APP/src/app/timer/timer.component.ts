// timer.component.ts

import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-timer',
  template: `
    <button (click)="startTimer()">Start Timer</button>
    <input [(ngModel)]="newWebSocketCode" placeholder="Enter WebSocket Code" />
    <button (click)="joinWebSocket()">Join WebSocket</button>

    <div *ngIf="websocketService.socketUrl">WebSocket URL: {{ websocketService.socketUrl }}</div>

    <div *ngIf="countdownValue >= 0">Timer: {{ countdownValue }} seconds</div>

    <div *ngFor="let message of messages">{{ message }}</div>
  `,
})
export class TimerComponent implements OnInit {
  public messages: string[] = [];
  public newWebSocketCode: string;
  public countdownValue: number = -1;

  constructor(public websocketService: WebsocketService) {this.newWebSocketCode = '';}

  ngOnInit(): void {
    this.websocketService.connect();
    this.websocketService.getMessages().subscribe((message) => {
      const timerValue = parseInt(message, 10);
      if (!isNaN(timerValue)) {
        this.countdownValue = timerValue;
      } else if (message.startsWith('Joined WebSocket with code:')) {
        this.messages.push(message);
      }
    });

    this.websocketService.getCountdownUpdates().subscribe((countdownValue) => {
      this.countdownValue = countdownValue;
    });
  }

  startTimer(): void {
    this.websocketService.sendMessage('Start timer');
  }

  joinWebSocket(): void {
    if (this.newWebSocketCode) {
      this.websocketService.sendMessage(`Join timer with code: ${this.newWebSocketCode}`);
      this.newWebSocketCode = '';
    }
  }
}
