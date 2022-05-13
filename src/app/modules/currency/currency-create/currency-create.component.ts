import { Component, Input, OnInit,ChangeDetectorRef, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryApiService } from 'src/app/services/country.service';
import { CustomValidators } from 'ngx-custom-validators';
import { Currency, CurrencyFormat } from '../currency-format/currency-format.typings';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrencyComponent } from '../currency.component';
import { CurrencyApiService } from 'src/app/services/currency.service';


interface Country {
  error: boolean;
  data: [];
}

@Component({
  selector: 'app-currency-create',
  templateUrl: './currency-create.component.html',
  styleUrls: ['./currency-create.component.scss']
})
export class CurrencyCreateComponent implements OnInit {

  createEditCurrency: Currency;
  validForm;
  currencyForm: FormGroup;
  errorSeparators:string;
  filteredCountries: any[];
  POSITIONS = [{ value: "AFTER" }, { value: "BEFORE" }]
  SEPARATORS = [{ value: ",", text: "Comma (,)" }, { value: ".", text: "Dot (.)" }]
  filteredPositions = this.POSITIONS.slice();
  filteredSeparators = this.SEPARATORS.slice();
  currencyPreview:Currency = {
    "_id": "61227d5453e7b5000940263e",
    "countryCode": "ECU",
    "languageIsoCode": "es",
    "currencyCode": "USD",
    "format": {
      "useCode": true,
      "cents": 2,
      "currencyPosition": "BEFORE",
      "thousandIdentifier": ",",
      "decimalSeparator": "."
    },
    "createdAt": "2021-08-22T16:37:40.948Z"
  };
  subscribers = [];
  @Input() countries: any[];
  @Input() currency: Currency;
  @Output() validCurrency: EventEmitter<any | boolean> = new EventEmitter();
 
  isLoading: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {currency: Currency , countries:[]},
    private _countryService: CountryApiService,
    private _currencyService: CurrencyApiService,
    private _ref: ChangeDetectorRef,
    private readonly _formBuilder: FormBuilder,
    public _dialog: MatDialogRef<CurrencyComponent>,
  ) { }

  ngOnInit(): void {
    console.log(this.data,'edit modal')
    this.initForm();
    this.setFormValues();
    this.currencyForm.valueChanges.subscribe(formValue => {
      this.currencyPreview = this.createCurrencyStructure();
    });
    //this.filteredCountries = this.countries.slice();
  }

  getCountryList(){
    this._countryService.getCountries().then((response: Country) => {
      if(!response.error){
        this.countries = response.data;
      }
      this.isLoading = false;
      this._ref.detectChanges();
  })
  .catch((err) => { })
  }

  initForm() {
    this._startForm();
   
    this._verifiedform();
  }
  _startForm() {
    this.getCountryList();
    this.currencyForm = this._formBuilder.group({
      country: [null, [Validators.required]],//"US",
      languageIsoCode: "es",
      useCode: [false],
      cents: [0, [CustomValidators.range([0, 4])]],
      currencyPosition: [null, [Validators.required]],
      thousandIdentifier: [null, [Validators.required]],
      decimalSeparator: [null, [Validators.required]],
    });
  }
 
  _verifiedform() {
    const formularioFormGroup = this.currencyForm;
    const subscriber = formularioFormGroup
        .valueChanges
        .subscribe(
            formulario => {
              const noticiaValidada = formularioFormGroup.valid;
              if (noticiaValidada) {
                console.log('validateform')
                this.validForm = true;
                // formulario.nivelJuego = this.setearValorSelect(formulario.nivelJuego);
                // formulario.tipo = this.setearValorSelect(formulario.tipo);
                //this.validCurrency.emit(this.createCurrencyStructure());
              } else {
                this.validForm = false;
               // this.validCurrency.emit(false);
              }
            }
        );
    this.subscribers.push(subscriber);
  }

  removeErrorsSeparators(){
    this.currencyForm.controls['decimalSeparator'].setErrors(null);
    this.currencyForm.controls['thousandIdentifier'].setErrors(null);
  }

  changeThousandIdentifier($event){
    if($event.value == this.currencyForm.value.decimalSeparator){
      this.currencyForm.controls['thousandIdentifier'].setErrors({'incorrect': true});
      this.errorSeparators = "Thousand identifier can't be the same as the Decimal separator"
    }else {
      this.removeErrorsSeparators();
      this.errorSeparators ="Your selection is invalid"
    }
  }

  changeDecimalSeparator($event){
    if($event.value == this.currencyForm.value.thousandIdentifier){
      this.currencyForm.controls['decimalSeparator'].setErrors({'incorrect': true});
      this.errorSeparators = "Decimal separator can't be the same as the thousand identifier"
    }else {
      this.removeErrorsSeparators();
      this.errorSeparators ="Your selection is invalid"
    }
  }

  setFormValues() {
    console.log('SET VALUES',this.currency)
    if (this.currency) {
      let currency: any = { ...this.currency.format }
      //currency['country'] = this.findCountry();
      currency['languageIsoCode'] = this.currency.languageIsoCode;
      this.currencyForm.setValue(currency);
      this.currencyPreview = {...this.currency}
    }else{
      if(this.data){
        let currency: CurrencyFormat = { ...this.data.currency.format }
      //currency['country'] = this.findCountry();
      currency['languageIsoCode'] = this.data.currency.languageIsoCode;
      this.currencyForm.setValue(currency);
      this.currencyPreview = {...this.data.currency}
      }
    }
  }

  createCurrencyStructure(){
    let format = { ...this.currencyForm.value };
    delete format.languageIsoCode;
    delete format.country;

    let clonecurrency = {...this.currency}

    if (clonecurrency) {
      clonecurrency.format = format;
      clonecurrency.countryCode = this.currencyForm.value.country.iso3;
      clonecurrency.currencyCode = this.currencyForm.value.country.currency;
      clonecurrency.languageIsoCode = "es";
      return clonecurrency;
    } else {
      let newCurrency: any = {};
      newCurrency['format'] = format;
      newCurrency['countryCode'] = this.currencyForm.value.country.iso3;
      newCurrency['currencyCode'] = this.currencyForm.value.country.currency;
      newCurrency['languageIsoCode'] = "es";
      return newCurrency;
    }
  }

  validarFormulario(currency) {
    if (currency) {
        this.createEditCurrency = currency;
        this.validForm = true;
    } else {
        this.validForm = false;
    }
}

saveCurrency() {
    /* this._loadService.enableLoad(); */
    if (this.data.currency) {
      this.currency = this.data.currency;
    let formValue = this.currencyForm.value;
    this.currency.countryCode = formValue.country.iso3;
    this.currency.format = formValue;
    this.currency.currencyCode = formValue.country.currency;
    this.currency.languageIsoCode = formValue.country.iso2;
        this._currencyService
            .updateCurrency(this.currency)
            .subscribe(
                async r => {
                    /* this._loadService.disableLoad(); */
                    this._dialog.close(this.createEditCurrency);
                },
                err => {
                   /*  this._loadService.disableLoad(); */
                    console.error(err);
                },
            );
    } else {
        console.log(this.currencyForm.value.useCode, 'FORM')
        this.currency = {
            ...this.createEditCurrency,
        };
       
        let formValue = this.currencyForm.value;
        this.currency.countryCode = formValue.country.iso3;
        this.currency.format = formValue;
        this.currency.currencyCode = formValue.country.currency;
        this.currency.languageIsoCode = formValue.country.iso2;
        this._currencyService
            .createCurrency(this.currency)
            .subscribe(
                r => {
                    /* this._loadService.disableLoad(); */
                    this._dialog.close(r);
                },
                err => {
                    /* this._loadService.disableLoad(); */
                    console.error(err);
                },
            );
    }
}
}
