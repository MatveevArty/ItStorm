import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ServiceCardComponent} from "./components/service-card/service-card.component";



@NgModule({
  declarations: [ServiceCardComponent],
  imports: [
    CommonModule
  ],
  exports: [ServiceCardComponent]
})
export class SharedModule { }
