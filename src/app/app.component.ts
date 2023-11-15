import { Component, OnInit } from '@angular/core';
import { LoadingService } from './core/services/loading.service';
import { delay } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	loading = false;

	constructor(private loadingService: LoadingService) {}

	ngOnInit() {
		this.listenToLoading();
	}

	listenToLoading() {
		this.loadingService.isLoadingSubject.pipe(delay(0)).subscribe((loading) => {
			if (this.loading !== loading) this.loading = loading;
		});
	}
}
