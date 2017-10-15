import { Injectable } from '@angular/core';
import { Init } from './init-markers';

@Injectable()
export class MarkersService extends Init{

  constructor() { 
    super();
    console.log('MarketService Initialized....');
    this.load();
  }

  getMarkers() {
    var markers = JSON.parse(localStorage.getItem('markers'));
    return markers;
  }
  

}
