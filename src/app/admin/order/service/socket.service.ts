import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private orderSubject = new Subject<any>();
  private updateOrderSubject = new Subject<any>();
  private updateOrderStatusSubject = new Subject<any>();

  private site: string;
  private type: string;

  constructor() {
    // No parameters in the constructor for DI compatibility
    this.socket = io('http://localhost:3000'); // Set the server URL here
  }

  public initialize(site: string, type: string): void {
    this.site = site;
    this.type = type;

    // Set up listeners once `site` and `type` are provided
    this.socket.on(`new_order_${this.site}_${this.type}`, (order) => {
      this.orderSubject.next(order);
    });
    this.socket.on(`update_order_${this.site}_${this.type}`, (order) => {
      this.updateOrderSubject.next(order);
    });
    this.socket.on(`update_order_status_${this.site}_${this.type}`, (order) => {
      this.updateOrderStatusSubject.next(order);
    });
  }

  public onNewOrder(): Observable<any> {
    return this.orderSubject.asObservable();
  }

  public updateOrder(): Observable<any> {
    return this.updateOrderSubject.asObservable();
  }

  public updateOrderStatus(): Observable<any> {
    return this.updateOrderStatusSubject.asObservable();
  }
}
