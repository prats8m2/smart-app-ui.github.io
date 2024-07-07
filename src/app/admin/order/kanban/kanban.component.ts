import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { OrderService } from '../service/order.service';
import { IParams } from 'src/app/core/interface/params';
import { SocketService } from '../service/socket.service';
import { Subscription, interval } from 'rxjs';

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
	private subscription: Subscription;

	constructor(
		private orderService: OrderService,
		private socketService: SocketService,
		private cdr: ChangeDetectorRef
	) {
		document.body.setAttribute('data-bs-theme', 'dark');
		this.orderService.ordersChange.subscribe((res) => {
			if (res) {
				this.listOrders(res.siteId, res.orderType);
			}
		});
	}

	ngOnInit(): void {
		this.subscription = interval(60000).subscribe(() => {
			this.cdr.markForCheck();
		});
		this.socketService.onNewOrder().subscribe((order) => {
			this.orders.push(order);
			this.filterForKanban();
		});
	}

	async listOrders(siteId, type) {
		const orderParams: IParams = {
			siteId,
			type: type,
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
		const order = event.data;
		if (filteredList && event.dropEffect === 'move') {
			if (targetStatus != order.status) {
				this.updateOrderStatus(order.id, targetStatus);
			}
			let index = event.index;
			if (typeof index === 'undefined') {
				index = filteredList.length;
			}
			filteredList.splice(index, 0, event.data);
		}
	}

	onDropCompleted(item: any, filteredList?: any[]) {
		const index = filteredList.indexOf(item);
		filteredList.splice(index, 1);
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
	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	viewOrderDialog(orderId) {
		console.log(orderId);
	}
}
