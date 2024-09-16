import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AttendantRoutingModule } from './attendant-routing.module';

@NgModule({
	declarations: [HomeComponent],
	imports: [CommonModule, AttendantRoutingModule],
})
export class AttendantModule {}
