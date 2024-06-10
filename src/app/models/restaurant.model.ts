export interface OpeningHours {
  [day: string]: string[][];
}

export class Restaurant {
  id: number;
  name: string;
  image_url: string;
  address: string;
  phone: string;
  opening_hours: OpeningHours;
  created_at: string;
  rating: number;
  delivery_fee: number;
  latitude: number;
  longitude: number;
  distance: number;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.image_url = data.image_url;
    this.address = data.address;
    this.phone = data.phone;
    this.opening_hours = data.opening_hours;
    this.created_at = data.created_at;
    this.rating = parseFloat(data.rating.toFixed(1));
    this.delivery_fee = data.delivery_fee;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.distance = 0;
  }

  isOpen() {
    const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    const currentTime = new Date().toTimeString().split(' ')[0].slice(0, 5);
    const hours = this.opening_hours[currentDay]; // Access directly without JSON.parse()

    if (hours && hours.length > 0) {
      for (let period of hours) {
        const [start, end] = period;
        if (currentTime >= start && currentTime <= end) {
          return true;
        }
      }
    }

    return false;
  }


  calculateDistance(userLatitude: number, userLongitude: number) {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(this.latitude - userLatitude);
    const dLon = this.deg2rad(this.longitude - userLongitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(userLatitude)) * Math.cos(this.deg2rad(this.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    this.distance = R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
