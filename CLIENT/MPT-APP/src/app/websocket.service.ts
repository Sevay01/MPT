// websocket.service.ts

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: WebSocket;
  private subject!: Subject<string>;
  private countdownSubject!: Subject<number>;

  public socketUrl: string = '';

  constructor() {
    this.countdownSubject = new Subject<number>();
  }

  public connect(): void {
    const randomCode = Math.random().toString(36).substring(2, 8);
    this.socketUrl = `ws://localhost:3000/${randomCode}`;

    this.socket = new WebSocket(this.socketUrl);
    this.subject = new Subject<string>();

    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.socket.onmessage = (event) => {
      const message = event.data;
      this.subject.next(message);

      const timerValue = parseInt(message, 10);
      if (!isNaN(timerValue)) {
        this.countdownSubject.next(timerValue);
      }
    };
  }

  public sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket not open. Trying to send message:', message);

      setTimeout(() => {
        this.sendMessage(message);
      }, 1000);
    }
  }

  public getMessages(): Observable<string> {
    return this.subject.asObservable();
  }

  public getCountdownUpdates(): Observable<number> {
    return this.countdownSubject.asObservable();
  }
}
