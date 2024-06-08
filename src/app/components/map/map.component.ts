import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import * as Leaflet from "leaflet";
import { DataService } from "../../services/data.service";
import { IonicModule } from "@ionic/angular";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [
    IonicModule,
    NgIf
  ],
  standalone: true
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() latitude?: number;
  @Input() longitude?: number;
  @Input() showControls: boolean = true;
  @Input() selectLocationMode: boolean = false;
  @Input() mapId: string = ''; // Unique identifier for each map instance
  @Output() centerChanged = new EventEmitter<{ lat: number, lng: number }>();

  private map: Leaflet.Map | undefined;
  private tileLayer: Leaflet.TileLayer | undefined;
  private centerMarker: Leaflet.Marker | undefined;

  constructor(private data: DataService) { }

  ngOnInit() {
    if (!this.mapId) {
      this.mapId = 'map-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
    }
  }

  async ngAfterViewInit() {
    await this.initMap();
    this.map!.whenReady(() => {
      setTimeout(() => {
        this.map!.invalidateSize();
      }, 10);
    });
  }

  async initMap() {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const theme = prefersDark.matches ? "dark" : "light";

    this.map = Leaflet.map(this.mapId, {
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

    this.setTiles(theme);

    prefersDark.addEventListener('change', (mediaQuery) => {
      this.setTiles(mediaQuery.matches ? "dark" : "light");
    });

    this.map.on('drag', () => {
      if (this.selectLocationMode) {
        const center = this.map!.getCenter();
        this.centerChanged.emit({ lat: center.lat, lng: center.lng });
        if (!this.centerMarker) {
          this.centerMarker = Leaflet.marker(center, {
            icon: new Leaflet.Icon({
              iconSize: [30, 30],
              iconAnchor: [12.5, 30],
              iconUrl: 'assets/icons/location_map_pin.png',
            }),
          }).addTo(this.map!);
        } else {
          this.centerMarker.setLatLng(center);
        }
      }
    });

    if (this.selectLocationMode) {
      const center = this.map.getCenter();
      this.centerMarker = Leaflet.marker(center, {
        icon: new Leaflet.Icon({
          iconSize: [30, 30],
          iconAnchor: [12.5, 30],
          iconUrl: 'assets/icons/location_map_pin.png',
        }),
      }).addTo(this.map);

      return;
    }

    const currentLocation = Leaflet.latLng(this.data.getSelectedAddress().latitude, this.data.getSelectedAddress().longitude);
    const markers = [];

    markers.push(Leaflet.marker(currentLocation, {
      icon: new Leaflet.Icon({
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        iconUrl: 'assets/icons/user_map_pin.png',
      }),
    }).addTo(this.map));

    if (this.latitude && this.longitude) {
      const destination = Leaflet.latLng(this.latitude, this.longitude);
      let bounds = Leaflet.latLngBounds([currentLocation, destination]);

      bounds = bounds.pad(0.5);
      this.map.fitBounds(bounds);

      Leaflet.marker(destination, {
        icon: new Leaflet.Icon({
          iconSize: [30, 30],
          iconAnchor: [12.5, 30],
          iconUrl: 'assets/icons/location_map_pin.png',
        }),
      }).addTo(this.map);

      Leaflet.polyline([currentLocation, destination], { color: "#25a749" }).addTo(this.map);
    } else {
      const restaurants = await this.data.getRestaurantsWithinRadius();

      if (restaurants.length > 0) {
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
      }

      const bounds = Leaflet.latLngBounds(markers.map(marker => marker.getLatLng()));
      const paddedBounds = bounds.pad(0.4);
      this.map.fitBounds(paddedBounds);
    }
  }

  setTiles(theme: string) {
    if (this.tileLayer) {
      this.tileLayer.remove();
    }

    const tileUrl = theme === "dark"
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

    this.tileLayer = Leaflet.tileLayer(tileUrl, {
      maxZoom: 30,
      minZoom: 10,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    this.tileLayer.addTo(this.map!);

    const mapContainer = document.getElementById(this.mapId);
    if (mapContainer) {
      mapContainer.classList.remove('dark-theme', 'light-theme');
      mapContainer.classList.add(`${theme}-theme`);
    }
  }

  async centerMap() {
    const currentLocation = Leaflet.latLng(this.data.getSelectedAddress().latitude, this.data.getSelectedAddress().longitude);
    this.map?.flyTo(currentLocation, 20);
  }
}
