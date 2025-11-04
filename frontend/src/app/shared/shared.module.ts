import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ServiceCardComponent} from "./components/service-card/service-card.component";
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import { DateFormatPipe } from './pipes/date-format.pipe';
import { PriceFormatPipe } from './pipes/price-format.pipe';



@NgModule({
  declarations: [ServiceCardComponent, CategoryFilterComponent, DateFormatPipe, PriceFormatPipe],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  exports: [ServiceCardComponent, CategoryFilterComponent, DateFormatPipe, PriceFormatPipe]
})
export class SharedModule { }
