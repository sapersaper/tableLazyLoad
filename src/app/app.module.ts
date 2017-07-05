import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { HomeComponent } from './home/home.component';
import { Error404Component } from './errors/error404/error404.component';

import { GetSearchService } from './common/services/get-search.service';

import { appRoutes } from './app.routes';
import { TableComponent } from './grid/table/table.component';
import { TracerComponent } from './common/components/tracer/tracer.component';
import { LazyLoadDirective } from './common/directives/lazy-load.directive';

@NgModule({
  declarations: [
    Error404Component,
    AppComponent,
    GridComponent,
    HomeComponent,
    TableComponent,
    TracerComponent,
    LazyLoadDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MomentModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    GetSearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
