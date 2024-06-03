import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../../models/restaurant.model';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  restaurants: Restaurant[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private data: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadRestaurants();
  }

  async loadRestaurants() {
    try {
      this.restaurants = await this.data.getRestaurants();
      this.isLoading = false;
    } catch (err) {
      this.error = 'Failed to load restaurants';
      console.error(err);
      this.isLoading = false;
    }
  }
}
