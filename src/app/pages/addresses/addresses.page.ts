import { Component, OnInit } from '@angular/core';
import { GeocodingService } from '../../services/geocoding.service';
import { ModalController } from '@ionic/angular';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {
  query: string = '';
  searchResults: any[] = [];
  private searchTerms = new Subject<string>();

  constructor(
    private geocodingService: GeocodingService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.trim() === '') {
          return of([]);
        }
        return this.geocodingService.searchAddress(term).pipe(
          catchError(error => {
            console.error('Error in geocoding search:', error);
            return of([]);
          })
        );
      })
    ).subscribe(results => {
      this.searchResults = results;
    });
  }

  onSearchChange(event: any) {
    const query = event.target.value;
    this.searchTerms.next(query);
  }

  selectAddress(address: any) {
    this.modalController.dismiss(address);
  }

  close() {
    this.modalController.dismiss();
  }
}
