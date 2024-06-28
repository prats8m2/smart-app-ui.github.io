import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
	providedIn: 'root',
})
export class SocketService {
	private socket: Socket;
	private orderSubject = new Subject<any>();
	private listOrderSubject = new Subject<any>();

	constructor() {
		this.socket = io('http://localhost:3000'); // Change this to your server's URL
		this.socket.on('orderCreated', (order) => {
			this.orderSubject.next(order);
		});
		this.socket.on('listOrders', (order) => {
			this.listOrderSubject.next(order);
		});
	}

	public onNewOrder(): Observable<any> {
		return this.orderSubject.asObservable();
	}
	public listOrders(): Observable<any> {
		return this.listOrderSubject.asObservable();
	}
}
