import { Component, OnInit } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { OrderService } from '../service/order.service';
import { IParams } from 'src/app/core/interface/params';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { SocketService } from '../service/socket.service';

@Component({
	selector: 'app-kanban',
	templateUrl: './kanban.component.html',
	styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit {
	orders: any = [];

	newOrders: any = [];
	inProgresOrders: any = [];
	completedOrders: any = [];

	constructor(
		private orderService: OrderService,
		private socketService: SocketService
	) {
		document.body.setAttribute('data-bs-theme', 'dark');
		this.orderService.ordersChange.subscribe((res) => {
			if (res) {
				this.listOrders(res.siteId);
			}
		});
	}

	ngOnInit(): void {
		this.socketService.onNewOrder().subscribe((order) => {
			console.log('New order received:', order);
			this.orders.push(order);
			this.filterForKanban();
		});
	}

	async listOrders(siteId) {
		const orderParams: IParams = {
			siteId,
			limit: 100,
			pageNumber: 1,
		};
		const res = await this.orderService.listOrderPromise(orderParams);
		if (res.status) {
			this.orders = res.data.orders;
			this.filterForKanban();
		} else {
			return null;
		}
	}

	filterForKanban() {
		this.newOrders = this.orders.filter((t) => t.status === 1);
		this.inProgresOrders = this.orders.filter((t) => t.status === 2);
		this.completedOrders = this.orders.filter((t) => t.status === 3);
	}

	onDrop(event: DndDropEvent, filteredList?: any[], targetStatus?: number) {
		console.log('Drop', event);
		console.log('targetStatus', targetStatus);
		const order = event.data;
		if (
			filteredList &&
			event.dropEffect === 'move' &&
			targetStatus != order.status &&
			this.updateOrderStatus(order.id, targetStatus)
		) {
			let index = event.index;
			if (typeof index === 'undefined') {
				index = filteredList.length;
			}
			filteredList.splice(index, 0, event.data);
		}
	}

	onDragged(item: any, list: any[]) {
		console.log('Drraged', item);
		const index = list.indexOf(item);
		list.splice(index, 1);
	}

	// update order status
	async updateOrderStatus(id: number, status: number) {
		const res = await this.orderService.updateOrderStatus(id, status);
		if (res.status) {
			return true;
		} else {
			return false;
		}
	}
}
