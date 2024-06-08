import { Component, OnInit } from '@angular/core';
import { GeocodingService } from '../../services/geocoding.service';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import {DataService} from "../../services/data.service";
import {Address} from "../../models/address.model";
import {Router} from "@angular/router";

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
    private router: Router,
    private geocodingService: GeocodingService,
    private data: DataService
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

  async selectAddress(data: any) {
    const address: Address = {
      address: data.data.display_name,
      latitude: parseFloat(data.data.lat),  // Default latitude
      longitude: parseFloat(data.data.lon),  // Default longitude
      city: data.data.address.town,
      zip_code: data.data.address.postcode,
      door: 0,
      info: ""
    };
    await this.data.setSelectedAddress(address)
  }

  async openDetails(data: any | undefined) {
    const address: Address = data ? {
      address: data.data.display_name,
      latitude: parseFloat(data.data.lat),  // Default latitude
      longitude: parseFloat(data.data.lon),  // Default longitude
      city: data.data.address.town,
      zip_code: data.data.address.postcode,
      door: 0,
      info: ""
    } : this.data.getSelectedAddress()

    await this.router.navigate(["address-details"], {queryParams: {address: address}})
  }
}
