import { Injectable, OnDestroy } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocationEntity } from '../domain/model/location.entity';

@Injectable({ providedIn: 'root' })
export class LocationWebsocketService implements OnDestroy {

  private stomp = new RxStomp();
  private connected = false;

  connect(): void {
    if (this.connected) return;
    this.stomp.configure({
      brokerURL: environment.platformProviderWsUrl,
      reconnectDelay: 5000,
    });
    this.stomp.activate();
    this.connected = true;
  }

  watchLocation$(deviceId: string): Observable<LocationEntity> {
    const topic = `${environment.platformProviderWsTrackingTopicPath}/${deviceId}`;
    return this.stomp
      .watch(topic)
      .pipe(
        map(msg => {
          const raw = JSON.parse(msg.body);
          return new LocationEntity({
            id: raw.id,
            deviceId: raw.deviceId,
            latitude: raw.latitude,
            longitude: raw.longitude,
            timestamp: raw.timestamp,
          });
        })
      );
  }

  async disconnect(): Promise<void> {
    await this.stomp.deactivate();
    this.connected = false;
  }

  ngOnDestroy(): void {
    this.disconnect().catch(err => console.error('Error disconnecting WebSocket:', err));
  }
}
