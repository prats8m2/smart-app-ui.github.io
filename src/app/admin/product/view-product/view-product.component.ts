import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTES } from 'src/app/constants/routing';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountService } from '../../accounts/service/account.service';
import { ProductService } from '../service/product.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
	selector: 'app-view-product',
	templateUrl: './view-product.component.html',
	styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit {
	showListAccount: boolean =
		this.globalService.checkForPermission('LIST-ACCOUNT');
	showListSite: boolean = this.globalService.checkForPermission('LIST-SITE');
	showListProduct: boolean =
		this.globalService.checkForPermission('LIST-PRODUCT');
	showListCategory: boolean =
		this.globalService.checkForPermission('LIST-CATEGORY');
	showEditProduct: boolean =
		this.globalService.checkForPermission('UPDATE-PRODUCT');
	showDeleteProduct: boolean =
		this.globalService.checkForPermission('DELETE-PRODUCT');

	public productForm: FormGroup = this.formBuilder.group({
		account: [null],
		site: [null],
		productName: [null],
		productDesc: [null],
		categories: [null],
		productPrice: [null],
		status: [null],
		isNew: [null],
		isSpecial: [null],
		type: [null],
	});
	productId: any;
	productData: any;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private globalService: GlobalService,
		public accountService: AccountService,
		private productService: ProductService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.productForm.disable();
		this.activatedRoute.params.subscribe((params) => {
			this.productId = params['id'];
			this.productService.viewProduct(this.productId).then((res) => {
				if (res.status) {
					this.productData = res.data;
					const type =
						this.productData.type === 1
							? 'Food'
							: this.productData.type === 2
							? 'Amenities'
							: undefined;
					this.productForm.patchValue({
						account: this.productData.site.account.name,
						site: this.productData.site.name,
						productName: this.productData.name,
						productDesc: this.productData.description,
						categories: this.productData.categories.map(
							(category) => category.name
						),
						productPrice: this.productData.price,
						status: this.productData.status,
						isNew: this.productData.isNew,
						isSpecial: this.productData.isSpecial,
						type: type,
					});
				}
			});
		});
	}

	routeToListProduct() {
		this.router.navigateByUrl(URL_ROUTES.LIST_PRODUCT);
	}

	routeToEditProduct() {
		this.router.navigateByUrl(URL_ROUTES.EDIT_PRODUCT + '/' + this.productId);
	}

	deleteProduct() {
		this.dialogService.openDeleteConfirmDialog().then((result) => {
			if (result.value) {
				//call delete product API
				this.productService.deleteProduct(this.productId).then((res: any) => {
					if (res.status) {
						this.router.navigateByUrl(URL_ROUTES.LIST_PRODUCT);
					}
				});
			}
		});
	}
}
