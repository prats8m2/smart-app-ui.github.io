import {
	HTTP_INTERCEPTORS,
	HttpClient,
	HttpClientModule,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutsModule } from './layouts/layouts.module';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { FakeBackendInterceptor } from './core/helpers/fake-backend';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { HttpRequestInterceptor } from './core/interceptor/HttpRequestInterceptor';
import { NgSelectModule } from '@ng-select/ng-select';

export function createTranslateLoader(http: HttpClient): any {
	return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
		}),
		LayoutsModule,
		AppRoutingModule,
		CarouselModule,
		AccordionModule.forRoot(),
		TabsModule.forRoot(),
		TooltipModule.forRoot(),
		ScrollToModule.forRoot(),
		ToastrModule.forRoot(),
		NgbDatepickerModule,
		NgSelectModule,
	],
	bootstrap: [AppComponent],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{
			provide: HTTP_INTERCEPTORS,
			useClass: FakeBackendInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpRequestInterceptor,
			multi: true,
		},

		// LoaderService,
		// { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
	],
})
export class AppModule {}
