import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToasterService } from 'angular2-toaster';
import { CurrencyApiService } from 'src/app/services/currency.service';
import { CurrencyCreateComponent } from './currency-create/currency-create.component';
import { Currency } from './currency-format/currency-format.typings';

interface Response {
    total: number;
    result: Currency[];
}


@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html',
    styleUrls: ['./currency.component.scss'],
    providers: [ToasterService],
})
export class CurrencyComponent implements OnInit {

    currencies: Currency[] = [];
    isLoading: boolean = true;

    constructor(
        private _currencyService: CurrencyApiService,
        private _ref: ChangeDetectorRef,
        public _dialog: MatDialog,
        public _notification: ToasterService
    ) {
    }

    ngOnInit(): void {
        this.getCurrencyList();
    }

    getCurrencyList() {
        this._currencyService.getCurrencies().then((response: Response) => {
            this.currencies = response.result;
            this.isLoading = false;
            this._ref.detectChanges();
        })
            .catch((err) => { })
    }


    openDialogEditCreate(currencySelect?: Currency): void {
        const dialogRef = this._dialog.open(
            CurrencyCreateComponent,
            {
                data: {
                    currency: currencySelect,
                },
            }
        );
        const resultModal$ = dialogRef.afterClosed();
        resultModal$
            .subscribe((recordcreated: Currency) => {
                if (recordcreated) {
                    if (currencySelect) {
                        const indiceRegistro = this.currencies.indexOf(currencySelect);
                        this.currencies[indiceRegistro] = recordcreated;
                        this.getCurrencyList();
                        this._notification.pop(
                            'info',
                            'Success',
                            'Currency Updated'
                        );
                    } else {
                        this.currencies.unshift(recordcreated);
                        this.getCurrencyList();
                        this._notification.pop(
                            'success',
                            'Success',
                            'Currency Created'
                        );
                    }
                }
            });
    }

    deleteCurrency(currency?: Currency) {
        this._currencyService.deleteCurrency(currency._id).subscribe(
            res => {
                this.getCurrencyList();
                this._notification.pop(
                    'success',
                    'Success',
                    'Currency Deleled'
                );
            }
            , error => {
                this._notification.pop(
                    'error',
                    'Error',
                    'Error to delete a currency'
                );
            }
        )
    }

}
