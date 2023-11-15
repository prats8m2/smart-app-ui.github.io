import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { LoaderComponent } from './loader/loader.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
@NgModule({
	declarations: [PagetitleComponent, LoaderComponent, ConfirmDialogComponent],
	imports: [CommonModule, FormsModule],
	exports: [PagetitleComponent, LoaderComponent],
})
export class UIModule {}
