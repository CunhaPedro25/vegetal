import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiUrl = 'https://nominatim.openstreetmap.org/';

  constructor(private http: HttpClient) {}

  searchAddress(query: string): Observable<any[]> {
    const params = {
      q: query,
      format: 'json',
      addressdetails: '1',
      countrycodes: 'pt'
    };
    return this.http.get<any[]>(this.apiUrl + "search", { params });
  }

  getAddress(latitude: number, longitude: number) {
    const params = {
      format: 'json',
      lat: latitude,
      lon: longitude
    };
    return this.http.get<any>(this.apiUrl + "reverse", {params});
  }
}
