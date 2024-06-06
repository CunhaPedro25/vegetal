import {Component, OnInit, Input} from '@angular/core';
import * as Leaflet from "leaflet";
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true
})
export class MapComponent implements OnInit {
  @Input() latitude?: number;
  @Input() longitude?: number;
  @Input() showControls: boolean = true;

  constructor(private data: DataService) { }

  private map: Leaflet.Map | undefined;

  // Metodo para inicializar o mapa com as configurtações necessárias
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
      attributionControl: this.showControls,
    });


    const tiles = Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 40,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    this.map.addLayer(tiles);

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

        Leaflet.marker(currentLocation, {
          icon: new Leaflet.Icon({
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            iconUrl: 'assets/icons/user_map_pin.png',
          }),
        }).addTo(this.map);

        const bounds = Leaflet.latLngBounds(markers.map(marker => marker.getLatLng()));
        const paddedBounds = bounds.pad(0.1);
        this.map.fitBounds(paddedBounds);
      }
    }

    this.map.whenReady(() => {
        this.map!.invalidateSize();
    });
  }

  async updateMap() {
    await this.initMap();
  }

  async ngOnInit() {
    await this.initMap();
  }
}
