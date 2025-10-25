import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ServiceCardComponent} from "./components/service-card/service-card.component";
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';



@NgModule({
  declarations: [ServiceCardComponent, CategoryFilterComponent],
  imports: [
    CommonModule
  ],
  exports: [ServiceCardComponent, CategoryFilterComponent]
})
export class SharedModule { }
