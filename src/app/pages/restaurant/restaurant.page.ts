import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { count } from 'rxjs';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {

  public restaurant: number = 1;
  public selectedSegment: string = 'menu';
  public drinks: any[] = [];
  public foods: any[] = [];
  public desserts: any[] = [];
  public items: any[] = [];
  rest: number = 1;

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  constructor(
    private data: DataService
  ) {}

  ngOnInit() {
    this.getitems();
  }

  async getitems() {
    
    this.items = await this.data.getItems(this.rest); 
    console.log(this.items);
    //meter items com contador de quantidade
    this.items.forEach(item =>  item.count = 0);
    this.foods = this.items.filter(item => item.category === 'food');
    this.drinks = this.items.filter(item => item.category === 'drink');
    this.desserts = this.items.filter(item => item.category === 'dessert');
  }
}
