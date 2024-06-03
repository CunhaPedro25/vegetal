import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {

  selectedSegment: string = 'menu';
  drinks: any[] = [];
  foods: any[] = [];
  desserts: any[] = [];

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  constructor() {}

  ngOnInit(
    
  ) {
  }

}
