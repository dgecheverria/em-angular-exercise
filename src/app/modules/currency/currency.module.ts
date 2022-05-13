import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Routes } from '@angular/router';
// import {ErrorsRoutingModule} from './errors-routing.module';
import { RouterModule } from '@angular/router';
import { CurrencyFormat } from './currency-format/currency-format.component';
import { PricePreview } from './price-preview/price-preview.component';
import { CurrencyComponent } from './currency.component';
import { CurrencyApiService } from 'src/app/services/currency.service';
import { CountryApiService } from 'src/app/services/country.service';
import { CurrencyCreateComponent } from './currency-create/currency-create.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatSelectFilterModule} from "mat-select-filter";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {ToasterModule, ToasterService} from "angular2-toaster";

const routes: Routes = [
    {
      path: '',
      component: CurrencyComponent,
      children: [
        // {
        //   path: 'your-path',
        //   component: YourComponent,
        // },
        // { path: '', redirectTo: 'accordion', pathMatch: 'full' },
        // { path: '**', redirectTo: 'accordion', pathMatch: 'full' },
      ],
    },
  ];

@NgModule({
  
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSelectFilterModule,
    MatCheckboxModule,
    MatInputModule,
    ToasterModule.forRoot()
  ],
  exports: [
    RouterModule,
    CurrencyComponent
  ],
  declarations: [
      CurrencyComponent,
      CurrencyFormat,
      PricePreview,
      CurrencyCreateComponent
  ],
  providers: [
    CurrencyApiService,
    CountryApiService,
    ToasterService
  ]
})
export class CurrencyModule {}
