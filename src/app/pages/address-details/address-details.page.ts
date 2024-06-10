import {Component, OnInit, ViewChild} from '@angular/core';
import {Address} from "../../models/address.model";
import {DataService} from "../../services/data.service";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Storage} from "@ionic/storage-angular";
import { Location } from '@angular/common';
import {IonModal} from "@ionic/angular";
import {GeocodingService} from "../../services/geocoding.service";

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.page.html',
  styleUrls: ['./address-details.page.scss'],
})
export class AddressDetailsPage implements OnInit {
  @ViewChild('modal') modal: IonModal | undefined;

  fields = this.fb.nonNullable.group({
    door: [0, [Validators.required, Validators.pattern('[0-9]*')]],
    info: [''],
  })

  address?: Address;
  lat: number = 0;
  lng: number = 0;

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private auth: AuthService,
    private geocoding: GeocodingService,
    private storage: Storage,
    private location: Location
  ) { }

  get door(){
    return this.fields.controls.door;
  }

  async saveAddress(){
    if(this.address){
      this.address.door = this.fields.getRawValue().door;
      this.address.info = this.fields.getRawValue().info;
      await this.data.setSelectedAddress(this.address);
      if(this.address.id == undefined){
        await this.storage.create()
        let userId = this.auth.getCurrentUserId()
        if(!userId) userId = await this.storage.get("user_id")

        if(userId) {
          let temp = await this.data.checkAddressExists(userId, this.address.address)
          if(!temp){
            await this.data.createAddress(userId, this.address)
          }else{
            await this.data.updateAddress(temp.id, this.address);
          }
        }
      }else{
        await this.data.updateAddress(this.address.id, this.address);
      }
      this.location.back();
    }
  }

  checkCenter(e: {lat: number, lng: number}) {
    this.lat = e.lat
    this.lng = e.lng
  }

  async setCoords() {
    if (this.address) {
      this.address.latitude = this.lat;
      this.address.longitude = this.lng;

      // Call the getAddress method from GeocodingService
      this.geocoding.getAddress(this.lat, this.lng).subscribe((addressData) => {
        if (addressData) {
          this.address!.address = addressData.display_name;
          this.address!.city = addressData.address.city;
          this.address!.zip_code = addressData.address.postcode;
        } else {
          console.log('No address found for the given coordinates.');
        }
      });

      this.data.setSelectedAddress(this.address!).then(() => {
        this.modal?.dismiss()
      })
    }
  }

  closeModal(){
    this.modal?.dismiss()
  }

  async ngOnInit() {
    this.address = this.data.getSelectedAddress()
    this.fields.setValue({door: this.address.door, info: this.address.info})
  }
}
