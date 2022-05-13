import {
    Component,
    Input,
    OnInit,
    SimpleChanges,
    OnChanges
  } from '@angular/core';
  
  import { Currency, CurrencyFormat } from '../currency-format/currency-format.typings';
  @Component({
    selector: 'price-preview',
    templateUrl: './price-preview.component.html',
    styleUrls: [],
  })
  export class PricePreview implements OnInit, OnChanges {

    // {
    //     "format": {
    //         "useCode": true,
    //         "cents": 2,
    //         "currencyPosition": "BEFORE",
    //         "thousandIdentifier": ",",
    //         "decimalSeparator": "."
    //     }
    // }
    priceFormat: string = "$1.234";
    exampleThousands = "1"
    exampleHundreds = "2345"
    exampleDecimals = "67890"
    eurSymbol = "€"
    dollarSymbol = "$"

    @Input() format: Currency;

    constructor() { }
  

    
    ngOnInit(): void {
      this.generateFormat();
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      this.generateFormat();
    }

    
    generateFormat() {
      if (this.format.format) {
          if (this.format.format.useCode) {
              this.getFormatWithCode();
          } else {
              this.getFormatWithSymbol();
          }
      }
  }

  getFormatWithCode() {
      if (this.format.format.currencyPosition == "AFTER") {
          this.priceFormat = this.validateThousandIdentifier()
              + this.getCents() + " " + this.format.currencyCode
      } else {
          this.priceFormat = this.format.currencyCode + " " + this.validateThousandIdentifier()
              + this.getCents()
      }
  }

  validateThousandIdentifier() {
      if (this.format.format.thousandIdentifier) {
          return this.exampleThousands + this.format.format.thousandIdentifier + this.exampleHundreds;
      }
      return this.exampleThousands + "," + this.exampleHundreds
  }

  getFormatWithSymbol() {
      if (this.format.format.currencyPosition == "AFTER") {
          this.priceFormat = this.validateThousandIdentifier()
              + this.getCents() + " " + this.getSymbol()
      } else {
          this.priceFormat = this.getSymbol() + " " + this.validateThousandIdentifier()
              + this.getCents()
      }
  }

  getSymbol() {
      if (this.format.currencyCode == 'EUR') {
          return this.eurSymbol
      } else {
          return this.dollarSymbol
      }
  }

  getCents() {
      let decimals = "";
      if (this.format.format.cents > 0) {
          decimals = this.validateDecimalSeparator();
      }
      return decimals + this.exampleDecimals.substring(0, this.format.format.cents);
  }

  validateDecimalSeparator() {
      if (this.format.format.decimalSeparator) {
          return this.format.format.decimalSeparator;
      } else {
          return "."
      }
  }
  }
  