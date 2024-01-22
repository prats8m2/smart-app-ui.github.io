import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
	PRODUCT_DESC_VALIDATION,
	PRODUCT_NAME_VALIDATION,
} from 'src/app/constants/validations';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { CategoryService } from '../../category/service/category.service';
import { SiteService } from '../../site/service/site.service';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	hasError,
	isValid,
	isTouchedAndValid,
	isTouched,
} from 'src/app/core/helpers/form-error';
import { errorMessages } from 'src/app/core/helpers/form-error-message';
import { ProductService } from '../service/product.service';

@Component({
	selector: 'app-add-product',
	templateUrl: './add-product.component.html',
	styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
	isProduction = environment.production;
	public productForm: FormGroup;
	accountList: any = [];
	siteList: any = [];
	categoryList: any = [];
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListProduct: boolean =
		this.globalService.checkForPermission('LIST-PRODUCT');
	showListCategory: boolean =
		this.globalService.checkForPermission('LIST-CATEGORY');
	accountParams: IParams = {
		limit: 100,
		pageNumber: 1,
	};

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};
	categoryParams: IParams = {
		siteId: null,
		limit: 100,
		pageNumber: 1,
	};

	productTypes = [
		{ id: 1, label: 'Food' },
		{ id: 2, label: 'Amenities' },
	];

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private siteServices: SiteService,
		private categoryService: CategoryService,
		private productService: ProductService
	) {
		if (this.isProduction) {
			this.productForm = this.formBuilder.group({
				account: [null],
				site: [Validators.required],
				productName: ['', PRODUCT_NAME_VALIDATION],
				productDesc: [null, PRODUCT_DESC_VALIDATION],
				categories: [[], Validators.required],
				productPrice: [null, Validators.required],
				status: [true],
				isNew: [true],
				isSpecial: [true],
				type: [null, Validators.required],
			});
		} else {
			const randomNumber = Math.floor(1000 + Math.random() * 9000);
			this.productForm = this.formBuilder.group({
				account: [null],
				site: [Validators.required],
				productName: ['PROD_' + randomNumber, PRODUCT_NAME_VALIDATION],
				productDesc: [null, PRODUCT_DESC_VALIDATION],
				categories: [[], Validators.required],
				productPrice: [null, Validators.required],
				status: [true],
				isNew: [true],
				isSpecial: [true],
				type: [null, Validators.required],
			});
		}
	}

	ngOnInit(): void {
		if (this.showListAccount) {
			this.accountService.listUser(this.accountParams).subscribe((res) => {
				if (res.status) {
					this.accountList = [...res.data.users];
					if (this.accountList.length) {
						this.siteParams.accountId = this.accountList[0].account.id;
						this.listSiteAPI(this.siteParams);
					}
				}
			});
		} else {
			this.listSiteAPI(this.siteParams);
		}
		this.productForm.get('status').disable();
		this.productForm.get('isNew').disable();
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.siteList = [...res.data.sites];
			}
		});
	}

	routeToListProduct() {
		this.router.navigateByUrl(URL_ROUTES.LIST_PRODUCT);
	}

	addProduct() {
		this.productService.addProduct(this.productForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_PRODUCT]);
			} else {
				console.log('ERROR');
			}
		});
	}

	//form validation function
	isError(formControlName: string, errorType: string): boolean {
		return hasError(this.productForm, formControlName, errorType);
	}

	showError(formControlName: string): boolean {
		return isValid(this.productForm, formControlName);
	}

	showSuccess(formControlName: string): boolean {
		return isTouchedAndValid(this.productForm, formControlName);
	}

	formTouched(formControlName: string): boolean {
		return isTouched(this.productForm, formControlName);
	}

	errorMessage(formControlName: string, errorType: string): string {
		return errorMessages[formControlName][errorType];
	}

	changeAccountData(accountId: any) {
		this.siteParams.accountId = accountId;
		this.productForm.get('account').patchValue(accountId);
		this.listSiteAPI(this.siteParams);
	}

	changeSiteData(siteId: any) {
		//list categories
		this.categoryParams.siteId = siteId;
		this.listCategoryApi(this.categoryParams);
	}

	listCategoryApi(params: IParams) {
		this.categoryService.listCategory(params).subscribe((res) => {
			if (res.status) {
				this.categoryList = [...res.data.categories];
			}
		});
	}

	toggle(control): void {
		const statusControl = this.productForm.get(`${control}`) as FormControl;
		statusControl.setValue(!statusControl.value);
	}
}
