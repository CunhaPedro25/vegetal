import { Component, OnInit } from '@angular/core';
import {Restaurant} from "../../models/restarurant.model";
import {DataService} from "../../services/data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  restaurants: Restaurant[] | undefined;
  constructor(
    private data: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.data.getRestaurants().then(r => {
      console.log(r);
    })

    this.restaurants = [
      {
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1cmdlcnxlbnwwfHwwfHx8MA%3D%3D',
        name: 'The Culinary Delight',
        description: 'A fine dining experience with a blend of world cuisines.',
        address: '123 Food Street, Flavor Town',
        latitude: 40.712776,
        longitude: -74.005974,
        categories: ['Fine Dining', 'International']
      },
      {
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1cmdlcnxlbnwwfHwwfHx8MA%3D%3D',
        name: 'Burger Haven',
        description: 'The best burgers in town, made with fresh ingredients.',
        address: '456 Burger Lane, Grill City',
        latitude: 34.052235,
        longitude: -118.243683,
        categories: ['Fast Food', 'Burgers']
      },
      {
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1cmdlcnxlbnwwfHwwfHx8MA%3D%3D',
        name: 'Sushi World',
        description: 'Authentic sushi and Japanese cuisine in a modern setting.',
        address: '789 Sushi Blvd, Fishville',
        latitude: 35.689487,
        longitude: 139.691711,
        categories: ['Japanese', 'Sushi']
      }
    ];
  }

}
