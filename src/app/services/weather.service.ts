import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  // private _http = inject(HttpService);
  constructor(private _http : HttpService) { }


  getWeather(latitud?: string, longitud?: string){
    // let url = `https://api.open-meteo.com/v1/forecast?latitude=-33.45&longitude=-70.65&hourly=temperature_2m,relative_humidity_2m`;
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&hourly=temperature_2m,relative_humidity_2m`;
    return this._http.get(url);
  }


}
