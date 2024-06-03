import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantReviewsPage } from './restaurant-reviews.page';

describe('RestaurantReviewsPage', () => {
  let component: RestaurantReviewsPage;
  let fixture: ComponentFixture<RestaurantReviewsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantReviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
