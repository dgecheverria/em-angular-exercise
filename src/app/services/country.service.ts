import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CountryApiService {
	public readonly apiUrl = environment.apiUrlCountries;
  
    httpOption = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
        })
    }
    
    constructor(public http: HttpClient) { }

    getCountries() {
        const url = this.apiUrl ;
    	return this.http.get(url,this.httpOption).toPromise();
    }

    // --- Add the rest of your CRUD operations here ---

}