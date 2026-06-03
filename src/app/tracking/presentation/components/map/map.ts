import {Component, signal, viewChild, ChangeDetectionStrategy} from '@angular/core';
import { GoogleMap, MapAdvancedMarker, MapInfoWindow } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  imports: [GoogleMap, MapAdvancedMarker, MapInfoWindow],
  templateUrl: './map.html',
  styleUrl: './map.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Map {

  location = signal<google.maps.LatLngLiteral>({
    lat: -12.1984517,
    lng: -77.0110082
  });

  mapOptions: google.maps.MapOptions = {
    mapId: 'API_KEY_MAP_ID',
  };

  markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    gmpDraggable: false,
  };

  zoom = 16;

  private infoWindow = viewChild.required<MapInfoWindow>(MapInfoWindow);
  private marker = viewChild<MapAdvancedMarker>(MapAdvancedMarker);

  getMarkerContent(): HTMLElement {
    const div = document.createElement('div');
    div.style.cssText = `
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      font-size: 20px;
    `;
    div.textContent = '🧓';
    return div;
  }

  openInfo(): void {
    const loc = this.location();
    const template = `
      <div style="padding: 8px;">
        <strong>Adulto mayor</strong><br/>
        <small>Lat: ${loc.lat.toFixed(6)}</small><br/>
        <small>Lng: ${loc.lng.toFixed(6)}</small>
      </div>
    `;
    this.infoWindow().open(this.marker(), false, template);
  }
}
