import {Component, OnInit, Input} from '@angular/core';
import * as Leaflet from "leaflet";
import { DataService } from "../../services/data.service";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class MapComponent implements OnInit {
  @Input() latitude?: number;
  @Input() longitude?: number;
  @Input() showControls: boolean = true;
  private map: Leaflet.Map | undefined;

  constructor(
    private data: DataService,
  ) { }

  async initMap() {
    this.map?.off();
    this.map?.remove();

    this.map = Leaflet.map('map', {
      center: [this.data.getSelectedAddress().latitude, this.data.getSelectedAddress().longitude],
      zoom: 17,
      dragging: this.showControls,
      scrollWheelZoom: this.showControls,
      tap: this.showControls,
      doubleClickZoom: this.showControls,
      keyboard: this.showControls,
      zoomControl: this.showControls,
      attributionControl: false
    });

    Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 30,
      minZoom: 10,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    const currentLocation = Leaflet.latLng(this.data.getSelectedAddress().latitude, this.data.getSelectedAddress().longitude);
    if(this.latitude && this.longitude) {
      const destination = Leaflet.latLng(this.latitude, this.longitude);
      let bounds = Leaflet.latLngBounds([currentLocation, destination]);

      bounds = bounds.pad(0.5);
      this.map.fitBounds(bounds);

      Leaflet.marker(currentLocation, {
        icon: new Leaflet.Icon({
          iconSize: [30, 30],
          iconAnchor: [12.5, 30],
          iconUrl: 'assets/icons/location_map_pin.png',
        }),
      }).addTo(this.map);

      Leaflet.marker(destination, {
        icon: new Leaflet.Icon({
          iconSize: [30, 30],
          iconAnchor: [12.5, 30],
          iconUrl: 'assets/icons/location_map_pin.png',
        }),
      }).addTo(this.map);

      Leaflet.polyline([currentLocation, destination], { color: "#25a749" }).addTo(this.map);
    }else{
      const restaurants = await this.data.getRestaurantsWithinRadius()
      const markers = [];

      markers.push(Leaflet.marker(currentLocation, {
        icon: new Leaflet.Icon({
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          iconUrl: 'assets/icons/user_map_pin.png',
        }),
      }).addTo(this.map))

      if(restaurants.length > 0) {
        for (const restaurant of restaurants) {
          const marker = Leaflet.marker([restaurant.latitude, restaurant.longitude], {
            icon: new Leaflet.Icon({
              iconSize: [30, 30],
              iconAnchor: [12.5, 30],
              iconUrl: 'assets/icons/location_map_pin.png',
            }),
            title: restaurant.name
          }).addTo(this.map);
          markers.push(marker);
        }

        const bounds = Leaflet.latLngBounds(markers.map(marker => marker.getLatLng()));
        const paddedBounds = bounds.pad(0.1);
        this.map.fitBounds(paddedBounds);
      }
    }

    this.map.whenReady(() => {
        this.map!.invalidateSize();
    });
  }

  async centerMap(){
    const currentLocation = Leaflet.latLng(this.data.getSelectedAddress().latitude, this.data.getSelectedAddress().longitude);
    this.map?.setView(currentLocation, 20)
  }

  async updateMap() {
    await this.initMap();
    this.map?.whenReady(() => {
      setTimeout(() => {
        this.map!.invalidateSize()
      }, 10)
    });
  }

  async ngOnInit() {
    await this.initMap();
  }
}
