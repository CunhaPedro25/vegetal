import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantCartPage } from './restaurant-cart.page';

describe('RestaurantCartPage', () => {
  let component: RestaurantCartPage;
  let fixture: ComponentFixture<RestaurantCartPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
