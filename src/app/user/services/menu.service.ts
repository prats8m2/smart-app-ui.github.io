import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { MENU, ORDER, USER } from 'src/app/constants/api';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';

@Injectable({
	providedIn: 'root',
})
export class MenuService {
	constructor(private http: HttpClient, private globalService: GlobalService) {}

	getAppMenu() {
		return this.http
			.get(MENU.APP_MENU)
			.toPromise()
			.then((response) => {
				const result = JSON.parse(JSON.stringify(response));
				return result;
			});
	}
}
