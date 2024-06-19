import { Component } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { OrderService } from '../service/order.service';
import { IParams } from 'src/app/core/interface/params';

@Component({
	selector: 'app-kanban',
	templateUrl: './kanban.component.html',
	styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent {
	orders: any = [];

	newOrders: any = [];
	inProgresOrders: any = [];
	completedOrders: any = [];

	constructor(private orderService: OrderService) {
		document.body.setAttribute('data-bs-theme', 'dark');

		this.orderService.ordersChange.subscribe((res) => {
			if (res) {
				this.listOrders(res.siteId);
			}
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

	onDrop(event: DndDropEvent, filteredList?: any[], targetStatus?: string) {
		console.log('Drop', event);
		if (filteredList && event.dropEffect === 'move') {
			let index = event.index;

			if (typeof index === 'undefined') {
				index = filteredList.length;
			}
			console.log(filteredList);
			filteredList.splice(index, 0, event.data);
			console.log(filteredList);
		}
	}

	onDragged(item: any, list: any[]) {
		console.log('Drraged', item);
		const index = list.indexOf(item);
		list.splice(index, 1);
	}

	// add new tak
	addnewTask(status: any) {
		// this.status = status;
		// this.assigneeMember = [];
		// this.memberLists.forEach((element) => {
		// 	element.checked = false;
		// });
		// this.modalForm.show();
	}
}
