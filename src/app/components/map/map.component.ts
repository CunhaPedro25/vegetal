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

  constructor(private data: DataService) { }

  private map: Leaflet.Map | undefined;

  // Metodo para inicializar o mapa com as configurtações necessárias
  async initMap() {
    this.map = Leaflet.map('map', {
      center: [this.data.getSelectedAddress().latitude, this.data.getSelectedAddress().longitude],
      zoom: 17
    });

    const tiles = Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 30,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    this.map.addLayer(tiles);

    if(this.latitude && this.longitude) {
      Leaflet.marker([this.latitude, this.longitude], {
        icon: new Leaflet.Icon({
          iconSize: [30, 40],
          iconAnchor: [13, 41],
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Map_pin_icon.svg/352px-Map_pin_icon.svg.png',
        }),
      }).addTo(this.map!);
    }else{
      const restaurants = await this.data.getRestaurantsWithinRadius()
      for (const restaurant of restaurants) {
        Leaflet.marker([restaurant.latitude, restaurant.longitude], {
          icon: new Leaflet.Icon({
            iconSize: [30, 40],
            iconAnchor: [13, 41],
            iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Map_pin_icon.svg/352px-Map_pin_icon.svg.png',
          }),
          title: restaurant.name
        }).addTo(this.map);
      }
    }

    Leaflet.marker([this.data.getSelectedAddress().latitude, this.data.getSelectedAddress().longitude], {
      icon: new Leaflet.Icon({
        iconSize: [30, 40],
        iconAnchor: [13, 41],
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Map_pin_icon.svg/352px-Map_pin_icon.svg.png',
      }),
      title: "Your location"
    }).addTo(this.map);

    this.map.whenReady(() => {
        this.map!.invalidateSize();
    });
  }

  async ngOnInit() {
    await this.initMap();
  }
}
