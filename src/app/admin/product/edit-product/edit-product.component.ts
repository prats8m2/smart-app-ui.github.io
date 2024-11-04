import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import {
	PRODUCT_DESC_VALIDATION,
	PRODUCT_NAME_VALIDATION,
} from 'src/app/constants/validations';
import {
	hasError,
	isTouched,
	isTouchedAndValid,
	isValid,
} from 'src/app/core/helpers/form-error';
import { errorMessages } from 'src/app/core/helpers/form-error-message';
import { IParams } from 'src/app/core/interface/params';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/service/account.service';
import { CategoryService } from '../../category/service/category.service';
import { SiteService } from '../../site/service/site.service';
import { ProductService } from '../service/product.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-edit-product',
	templateUrl: './edit-product.component.html',
	styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
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

	siteParams: IParams = {
		accountId: null,
		limit: 100,
		pageNumber: 1,
	};
	categoryParams: IParams = {
		siteId: null,
		type: null,
		limit: 100,
		pageNumber: 1,
	};

	siteCurrency: string  = '$';

	productId: any;
	productData: any;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private siteServices: SiteService,
		private categoryService: CategoryService,
		private productService: ProductService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService
	) {
		if (this.isProduction) {
			this.productForm = this.formBuilder.group({
				id: [null],
				account: [null],
				site: [Validators.required],
				productName: ['', PRODUCT_NAME_VALIDATION],
				productDesc: [null, PRODUCT_DESC_VALIDATION],
				categories: [null, Validators.required],
				productPrice: [null, Validators.required],
				status: [null],
				isNew: [null],
				isSpecial: [null],
				type: [null, Validators.required],
			});
		} else {
			this.productForm = this.formBuilder.group({
				id: [null],
				account: [null],
				site: [Validators.required],
				productName: [null, PRODUCT_NAME_VALIDATION],
				productDesc: [null, PRODUCT_DESC_VALIDATION],
				categories: [null, Validators.required],
				productPrice: [null, Validators.required],
				status: [null],
				isNew: [null],
				isSpecial: [null],
				type: [null, Validators.required],
			});
		}
	}

	ngOnInit(): void {
		this.patchProductFormData();
	}

	patchProductFormData() {
		this.activatedRoute.params.subscribe((params) => {
			this.productId = params['id'];
			this.productService.viewProduct(this.productId).then((res) => {
				if (res.status) {
					this.productData = res.data;
					this.productForm.patchValue({
						id: this.productId,
						account: this.productData.site.account.name,
						site: this.productData.site.id,
						productName: this.productData.name,
						productDesc: this.productData.description,
						categories: this.productData.categories.map(
							(category) => category.id
						),
						productPrice: this.productData.price,
						status: this.productData.status,
						isNew: this.productData.isNew,
						isSpecial: this.productData.isSpecial,
						type: this.productData.type === 1 ? 'Food' : 'Amenities',
					});
					this.siteCurrency = this.productData.site.settings.currency;
					this.productForm.get('account')?.disable();
					this.productForm.get('type')?.disable();
					const accountId = this.productData.site.account.id;
					this.siteParams.accountId = accountId;
					this.categoryParams.siteId = this.productData.site.id;
					this.categoryParams.type = this.productData.type;
					this.listSiteAPI(this.siteParams);
					this.listCategoryApi(this.categoryParams);
				}
			});
		});
	}

	listSiteAPI(params: IParams) {
		this.siteServices.listSites(params).subscribe((res) => {
			if (res.status) {
				this.siteList = [...res.data.sites];
			}
		});
	}

	routeToListProduct() {
		if (!this.productForm.dirty) {
			this.router.navigateByUrl(URL_ROUTES.LIST_PRODUCT);
		} else {
			this.dialogService.openBackConfirmDialog().then((result) => {
				if (result.value) {
					this.router.navigateByUrl(URL_ROUTES.LIST_PRODUCT);
				}
			});
		}
	}

	updateProduct() {
		const selectedCategoriesID = this.productForm.get('categories').value;

		const selectedCategoriesObjects = selectedCategoriesID.map(
			(id: number) => ({
				id,
			})
		);
		this.productForm.get('categories').patchValue(selectedCategoriesObjects);

		this.productService.updateProduct(this.productForm).then((res) => {
			if (res.status) {
				this.router.navigate([URL_ROUTES.LIST_PRODUCT]);
			} else {
				console.log('ERROR');
			}
		});

		console.log(this.productForm.getRawValue());
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

	changeSiteData(siteId: any) {
		//list categories
		if (siteId) {
			this.productForm.get('categories').patchValue(null);
			this.categoryParams.siteId = siteId;
			this.listCategoryApi(this.categoryParams);
		}
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
