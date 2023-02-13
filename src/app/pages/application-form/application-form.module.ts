import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplicationFormPageRoutingModule } from './application-form-routing.module';

import { ApplicationFormPage } from './application-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ApplicationFormPageRoutingModule
  ],
  declarations: [ApplicationFormPage]
})
export class ApplicationFormPageModule {}
