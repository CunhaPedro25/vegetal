import { Component, OnInit } from '@angular/core';
import { GeocodingService } from '../../services/geocoding.service';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import {DataService} from "../../services/data.service";
import {Address} from "../../models/address.model";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";
import {Storage} from "@ionic/storage-angular";
import {add} from "ionicons/icons";

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {
  query: string = '';
  searchResults: any[] = [];
  searchTerms = new Subject<string>();
  addresses: Address[] = [];
  loaded: boolean = false;

  constructor(
    private router: Router,
    private geocodingService: GeocodingService,
    protected data: DataService,
    private auth: AuthService,
    private storage: Storage,
    private toast: ToastController
  ) {}

  async ngOnInit() {
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

    this.loaded = false;
    let userId = this.auth.getCurrentUserId()
    if(!userId) userId = await this.storage.get("user_id")

    if(userId) {
      await this.storage.set("user_id", userId)
      this.addresses = await this.data.getUserAddresses(userId)
      this.loaded = true;
    }
  }

  onSearchChange(event: any) {
    const query = event.target.value;
    this.searchTerms.next(query);
  }

  async selectAddress(address: Address) {
    await this.data.setSelectedAddress(address);
    await this.router.navigate(["/"]);
  }

  async getAddress(data: any): Promise<void> {
    const address: Address = {
      address: data.display_name,
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),
      city: data.address.city,
      zip_code: data.address.postcode,
      door: 0,
      info: ""
    };

    let userId = this.auth.getCurrentUserId()
    if(!userId) userId = await this.storage.get("user_id")

    if(userId) {
      await this.storage.set("user_id", userId)
      try {
        const existingAddress = await this.data.checkAddressExists(userId, address.address);
        if (existingAddress) {
          // Address exists, set it as selected
          await this.data.setSelectedAddress(existingAddress);
        } else {
          // Address does not exist, create a new address
          const newAddress = await this.data.createAddress(userId, address);
          await this.data.setSelectedAddress(newAddress);
        }
        await this.router.navigate(["/"]);
      } catch (error) {
        console.error('Error selecting address:', error);
        await this.showErrorToast('Error selecting address');
      }
    }
  }

  async showErrorToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 1500,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }

  protected readonly add = add;
}
