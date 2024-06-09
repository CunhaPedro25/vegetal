import { Component, OnInit } from '@angular/core';
import {Address} from "../../models/address.model";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.page.html',
  styleUrls: ['./address-details.page.scss'],
})
export class AddressDetailsPage implements OnInit {
  address?: Address;
  loaded = false;

  constructor(
    private data: DataService,
  ) { }

  async ngOnInit() {
    this.address = this.data.getSelectedAddress()
  }
}
