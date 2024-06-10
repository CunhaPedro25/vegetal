import { Component, OnInit } from '@angular/core';
import {Address} from "../../models/address.model";
import {DataService} from "../../services/data.service";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Storage} from "@ionic/storage-angular";
import { Location } from '@angular/common';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.page.html',
  styleUrls: ['./address-details.page.scss'],
})
export class AddressDetailsPage implements OnInit {
  fields = this.fb.nonNullable.group({
    door: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    info: [''],
  })

  address?: Address;
  loaded = false;

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private auth: AuthService,
    private storage: Storage,
    private location: Location
  ) { }

  get door(){
    return this.fields.controls.door;
  }

  async saveAddress(){
    if(this.address){
      this.address.door = parseInt(this.fields.getRawValue().door);
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

  async ngOnInit() {
    this.address = this.data.getSelectedAddress()
  }
}
