import { Component } from '@angular/core';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { IParams } from '../../../core/interface/params';
import { UntypedFormGroup } from '@angular/forms';
import { URL_ROUTES } from '../../../constants/routing';

@Component({
  selector: 'app-list-accounts',
  templateUrl: './list-accounts.component.html',
  styleUrls: ['./list-accounts.component.scss']
})
export class ListAccountsComponent {

    constructor(
    public accountService: AccountService,
    private router: Router,
    private globalService: GlobalService
  ) {}

    usersList: any = [];
    total:number;
    perPage:number = 10;

  userParams: IParams = {
    limit: 10,
    pageNumber: 1,
  };

  ngOnInit(): void {
    this.listUserAPI();
  }

  listUserAPI() {
    this.accountService.listUser(this.userParams).then(res => {
      this.usersList = [...res.data.users];
      console.log('this.usersList:', this.usersList)
      this.total = this.usersList.length
    });
  }

  routeToAddAccount(){
    this.router.navigateByUrl(URL_ROUTES.ADD_ACCOUNT)
  }
  routeToEditAccount(accountId: number){
    this.router.navigateByUrl(URL_ROUTES.EDIT_ACCOUNT+'/'+accountId)
  }
  routeToViewAccount(accountId: number){
    this.router.navigateByUrl(URL_ROUTES.VIEW_ACCOUNT+'/'+accountId)
  }

}
