import { Injectable } from '@angular/core';
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpErrorResponse,
	HttpResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { StorageService } from '../services/storage.service';
import { StorageType } from 'src/app/constants/storage-type';
import { LoadingService } from '../services/loading.service';
import Swal from 'sweetalert2';
import { GlobalService } from '../services/global.service';
/** Inject With Credentials into the request */

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
	accessToken!: string | null;

	constructor(
		private loadingService: LoadingService,
		private globalService: GlobalService
	) {}

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		this.loadingService.showLoader();
		this.accessToken = StorageService.get(StorageType.ACCESS_TOKEN);
		let URL = environment.apiServer + req.url;
		if (req.url.includes('assets')) {
			return next.handle(req);
		}
		req = req.clone({
			url: URL,
			headers: req.headers.set(
				'token',
				this.accessToken ? this.accessToken : ''
			),
		});

		return next
			.handle(req)
			.pipe(
				retry(2),
				catchError((error: HttpErrorResponse) => {
					this.loadingService.hideLoader();
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Some error occurred while loading',
						toast: true,
						position: 'top-end',
						showConfirmButton: false,
						timer: 2000,
					});
					return throwError(error);
				})
			)
			.pipe(
				map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
					if (evt instanceof HttpResponse) {
						this.loadingService.hideLoader();
						if (evt.body.code === 501 || evt.body.code === 503) {
							window.location.href = '';
							StorageService.remove(StorageType.ACCESS_TOKEN);
						}
						if (req.method !== 'GET') {
							this.globalService.handleSuccessService(evt.body, true);
						} else {
							this.globalService.handleSuccessService(evt.body, false);
						}
					}
					return evt;
				})
			);
	}
}
