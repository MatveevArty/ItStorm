import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ServiceCardComponent} from "./components/service-card/service-card.component";
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [ServiceCardComponent, CategoryFilterComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  exports: [ServiceCardComponent, CategoryFilterComponent]
})
export class SharedModule { }
