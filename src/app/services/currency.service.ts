import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Currency } from '../modules/currency/currency-format/currency-format.typings';

@Injectable({
    providedIn: 'root'
})
export class CurrencyApiService {
	public readonly apiUrl = environment.apiUrl;
    private readonly ACCESS_KEY = environment.API_KEY;
   // private readonly COUNTRIES_CURRENCY:any[] = COUNTRY_CURRENCY;
    httpOption = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'X-API-KEY': this.ACCESS_KEY
        })
    }
    
    constructor(public http: HttpClient) { }

    getCurrencies() {
        const url = this.apiUrl + `currency-format/`;
    	return this.http.get(url,this.httpOption).toPromise();
    }

    createCurrency(currency:Currency){
        const url = this.apiUrl + 'currency-format/';
        const record = JSON.stringify(currency);
        console.log(record,'RECORDSAVE')
        return this.http.post(url, record,this.httpOption);
    }
    updateCurrency(currency: Currency ){
        const url = this.apiUrl + `currency-format/`+currency._id;
        return this.http.put(url, currency, this.httpOption);
    }
    deleteCurrency(currencyId: string){
        const url = this.apiUrl + `currency-format/${currencyId}`;
        return this.http.delete(url,this.httpOption);

    }
}