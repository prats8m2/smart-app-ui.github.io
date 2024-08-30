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
import { catchError, retry, map, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { StorageService } from '../services/storage.service';
import { StorageType } from 'src/app/constants/storage-type';
import { LoadingService } from '../services/loading.service';
import Swal from 'sweetalert2';
import { GlobalService } from '../services/global.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
	accessToken!: string | null;
	appAccessToken!: string | null;

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
		this.appAccessToken = StorageService.get(StorageType.APP_ACCESS_TOKEN);

		const URL = environment.apiServer + req.url;

		if (req.url.includes('assets')) {
			this.loadingService.hideLoader();
			return next.handle(req);
		}

		req = req.clone({
			url: URL,
			headers: req.headers.set(
				'token',
				this.accessToken ? this.accessToken : this.appAccessToken
			),
		});

		return next.handle(req).pipe(
			retry(2),
			map((evt) => this.handleSuccess(req, evt)),
			catchError((error) => this.handleError(error)),
			finalize(() => this.loadingService.hideLoader())
		);
	}

	private handleSuccess(
		req: HttpRequest<any>,
		evt: HttpEvent<any>
	): HttpEvent<any> {
		if (evt instanceof HttpResponse) {
			if (evt.body.code === 501 || evt.body.code === 503) {
				window.location.href = '';
				StorageService.remove(StorageType.ACCESS_TOKEN);
			}

			if (evt.body.status != true) {
				this.handleError(evt.body.message);
			} else {
				const isNonGetMethod = req.method !== 'GET';
				this.globalService.handleSuccessService(evt.body, isNonGetMethod);
				return evt;
			}
		}
	}

	private handleError(error: HttpErrorResponse): Observable<never> {
		Swal.fire({
			icon: 'error',
			text: 'Some error occurred',
			toast: true,
			position: 'top-end',
			showConfirmButton: false,
			timer: 2000,
		});
		return throwError(error);
	}
}
